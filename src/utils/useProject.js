import { useEffect, useRef, useState } from "react";
import { atom, useRecoilState, useResetRecoilState } from "recoil";
import parseFile from "./parser";
import { useFirebase } from "./useFirebase";

export const projectAtom = atom({ key: "projectState", default: {} });
const allCodeAtom = atom({ key: "allCode", default: '' });
export const editorModelsAtom = atom({ key: 'editorModels', default: {} })

export default function useProject() {
    const firebase = useFirebase()
    const [project, setProject] = useRecoilState(projectAtom);
    const [allCode, setAllCode] = useRecoilState(allCodeAtom);
    const resetEditorModels = useResetRecoilState(editorModelsAtom)
    const runCounter = useRef(0);

    const reset = () => {
        setProject({})
        setAllCode('')
        resetEditorModels()
        runCounter.current = 0
    }

    const initProject = async (name, withFiles = true, withInfo = true) => {
        try {
            const settings = await firebase.getFile(name, 'settings.json')
            const params = settings.params
            const snippets = await getSnippets(settings.snippets)
            const projectObj = { name, settings, params, snippets }
            
            if (withInfo)
                projectObj.explanation = await firebase.getFile(name, 'explanation.html')
            if (withFiles){
                const text_files = await firebase.getFile(name, settings.script)
                let files = text_files.split('//FILE ');
                files.shift();
                files = files.map((part) => {
                    const name = part.split('\n')[0].trim();
                    const code = part.slice(name.length).trim();
                    return { name, code };
                });
                projectObj.files = files
                setAllCode(files.map((f) => f.code).join('\n') + '\n');
            }
            setProject(projectObj)
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    }

    useEffect(() => {
        if (project.params && project.files) runParameters()
    }, [project.params])

    const runCode = (newCode) => {
        newCode += `\n // ---- this is run ${runCounter.current}`;
        setAllCode(newCode);
        runCounter.current++;
    }
    const runParameters = () => {
        let newCode = ''
        project.files.forEach((f) => {
            newCode += f.code + '\n';
        })
        Object.entries(project.params).forEach(([key, param]) => {
            newCode += getCodeLine(key, param)
        })
        runCode(newCode)
    }

    const runVariation = async (v) => {
        if (v.code) runCode(v.code)
        else {
            const newCode = await firebase.getFile(project.name, `${v.file}`)
            runCode(newCode);
            const newVariationsSetting = project.settings.variations.map((variation) => {
                if (variation.name == v.name) return { ...variation, code: newCode }
                return variation
            })
            const newSettings = { ...project.settings, variations: newVariationsSetting }
            setProject({ ...project, settings: newSettings })
        }
    }

    const rerun = () => {
        const lines = allCode.split('\n');
        lines.pop();
        runCode(lines.join('\n'));
    }


    return {
        project, allCode,
        reset, initProject,
        runCode, runParameters, runVariation, rerun
    }
}





function getCodeLine(key, param) {
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


const allHelperFiles = ['setup', 'hashgrid', 'utils', 'svg']
async function getSnippets(snippets) {
    if (!snippets) return {}
    if (snippets.length == 0) return {}

    let allHelperCode = ''
    for (const file of allHelperFiles) {
        let newUtil = await fetch(`/code/__utils/${file}.js`);
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