import { useEffect, useRef } from "react";
import { atom, useRecoilState, useResetRecoilState } from "recoil";
import { parseExplanation, parseFile, parseTutorialFile } from "./parser";
import { getFromFirebase, useFileManager } from "./useFileManager";

export const projectAtom = atom({ key: "projectState", default: {} });
const allCodeAtom = atom({ key: "allCode", default: '' });
export const editorModelsAtom = atom({ key: 'editorModels', default: {} })
const runningCodeAtom = atom({ key: 'runningCode', default: '' })

export default function useProject() {
    const fileManager = useFileManager()
    const [project, setProject] = useRecoilState(projectAtom);
    const [allCode, setAllCode] = useRecoilState(allCodeAtom);
    const [runningCode, setRunningCode] = useRecoilState(runningCodeAtom);
    const resetEditorModels = useResetRecoilState(editorModelsAtom)
    const runCounter = useRef(0);

    const reset = () => {
        setProject({})
        setAllCode('')
        setRunningCode('')
        resetEditorModels()
        runCounter.current = 0
    }

    const initProject = async (name, withFiles = true, withInfo = true) => {
        try {
            const settings = await fileManager.getFile(name, 'settings.json')
            const params = settings.params
            const snippets = await getSnippets(settings.snippets)
            const projectObj = { name, settings, params, snippets, variations: settings.variations }

            if (withInfo) {
                const explanationText = await fileManager.getFile(name, 'explanation.html')
                projectObj.explanation = parseExplanation(explanationText)
            }
            if (withFiles) {
                const text_files = await fileManager.getFile(name, settings.script)
                const files = parseFile(text_files)
                projectObj.originalFiles = files
                projectObj.files = files
                applyFiles(files, params)
            }
            setProject(projectObj)
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
        return
    }

    const applyFiles = (files, params) => {
        let code = files.map((f) => f.content).join('\n') + '\n'
        setAllCode(code);
        if (params) code = code + '\n\n' + getParamsCode(params) + `\n // ---- this is run ${runCounter.current++}`
        setRunningCode(code);
    }

    const applyVariation = async (v) => {
        if (v.name == 'original') {
            setProject(prev => ({ ...prev, files: prev.originalFiles }))
            applyFiles(project.originalFiles)
            return
        }
        if (v.files) {
            setProject(prev => ({ ...prev, files: v.files }))
            applyFiles(v.files)
            return
        }
        if (typeof v == 'string') v = project.variations.find((variation) => variation.file == v)
        const variationFile = await fileManager.getFile(project.name, `variations/${v.file}`)
        const files = parseFile(variationFile)
        const newVariation = { ...v, files }
        const newVariations = [...project.variations]
        const index = newVariations.findIndex((variation) => variation.name == v.name)
        newVariations[index] = newVariation

        setProject({ ...project, files, variations: newVariations })
        applyFiles(files)
    }

    const rerun = () => {
        setRunningCode(allCode + `\n // ---- this is run ${runCounter.current++}`)
    }
    const rerunParameters = (newParams) => {
        newParams = newParams || project.params
        const newCode = allCode + '\n\n' + getParamsCode(newParams) + `\n // ---- this is run ${runCounter.current++}`
        setRunningCode(newCode)
    }

    const share = async () => {
        const newCode = allCode + '\n\n' + getParamsCode(project.params) + `\n // ---- this is run ${runCounter.current++}`
        const hash = await fileManager.storeFile(project.name, newCode)
        const url = `${location.origin}/${project.name}/u/${hash}`
        navigator.clipboard.writeText(url)
        window.open(url, '_blank').focus();
    }

    const getParamsCode = (params) => {
        if (!project.params) return ''
        params = params || project.params
        let newCode = ''
        let objectCode = '{'
        Object.entries(params).forEach(([key, param]) => {
            newCode += getCodeLine(key, param)
            objectCode += `${key}:${key},`
        })
        objectCode += '}'
        newCode += `if (window.updateParams) updateParams(${objectCode});`
        return newCode
    }

    const loadUserContent = async (name,hash) => {
        const code = await getFromFirebase(name, hash)
        const newCode = code + `\n // ---- this is run ${runCounter.current++}`
        setRunningCode(newCode)
    }

    /// ----------------- TUTORIAL ----------------- ///
    /// ----------------- TUTORIAL ----------------- ///
    const loadTutorialLevel = async (levelIndex) => {
        if (levelIndex >= project.settings.levels.length) return
        const levelTxt = await fileManager.getFile(project.name, project.settings.levels[levelIndex])
        const levelObj = parseTutorialFile(levelTxt)
        let baseCode = project.baseCode
        if (!baseCode) {
            baseCode = await fileManager.getFile(project.name, 'base.js')
            setProject(prev => ({ ...prev, baseCode }))
        }
        if (!baseCode) return
        const newCode = baseCode.replace('***REPLACE***', levelObj.js) + `\n // ---- this is run ${runCounter.current++}`
        setRunningCode(newCode)
        setAllCode(levelObj.js)
        return levelObj
    }
    const updateTutorialCode = (code) => {
        const newCode = project.baseCode.replace('***REPLACE***', code) + `\n // ---- this is run ${runCounter.current++}`
        setRunningCode(newCode)
    }


    return {
        project, allCode, setAllCode, runningCode,
        reset, initProject, rerunParameters,
        rerun, applyVariation, share, getParamsCode,
        loadUserContent, 
        loadTutorialLevel, updateTutorialCode
    }
}





export function getCodeLine(key, param) {
    if (param.type == 'range') return `${key} = [${param.value[0]},${param.value[1]}];\n`

    if (param.type == 'array') {
        if (param.subtype == 'color') return `${key} = ['${param.value.join("','")}'];\n`
    }

    if (param.type == 'number') return `${key} = ${param.value};\n`
    if (param.type == 'color') return `${key} = '${param.value}';\n`
    if (param.type == 'boolean') return `${key} = ${param.value};\n`
    if (param.type == 'expression') return `${key} = ${param.value};\n`
    if (param.type == 'string') return `${key} = '${param.value}';\n`
    if (param.type == 'image') return `${key} = '${param.value}';\n`
}


const allHelperFiles = ['setup', 'hashgrid', 'utils', 'svg', 'paperUtils', 'poisson']
async function getSnippets(snippets) {
    if (!snippets) return {}
    if (snippets.length == 0) return {}

    let allHelperCode = ''
    for (const file of allHelperFiles) {
        let newUtil = await fetch(`/code/${file}.js`);
        newUtil = await newUtil.text();
        allHelperCode += newUtil + '\n';
    }

    const lines = allHelperCode.split('\n');
    let currentSnippet = null;
    let currentCode = [];
    const allSnippets = {}

    lines.forEach(line => {
        if (line.startsWith('//SNIPPET ')) {
            if (currentSnippet) {
                allSnippets[currentSnippet] = currentCode.join('\n').trim();
            }
            currentSnippet = line.split(' ')[1];
            currentCode = [];
        } else {
            currentCode.push(line);
        }
    });

    if (currentSnippet) {
        allSnippets[currentSnippet] = currentCode.join('\n').trim();
    }

    let res = {}
    snippets.forEach((snippet) => {
        res[snippet] = allSnippets[snippet]
    })

    return res
}