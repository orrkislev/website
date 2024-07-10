import { useEffect, useRef, useState } from "react";
import { atom, useRecoilState } from "recoil";

const projectName = 'genuary-physics';

export const projectAtom = atom({ key: "projectState", default: {} });
const allCodeAtom = atom({ key: "allCode", default: '' });

export default function useProject() {
    const [project, setProject] = useRecoilState(projectAtom);
    const [allCode, setAllCode] = useRecoilState(allCodeAtom);
    const runCounter = useRef(0);

    useEffect(() => {
        const fetchStuff = async () => {
            try {
                const res_settings = await fetch(`/code/${projectName}/settings.json`);
                const settings = await res_settings.json();

                const params = settings.params

                const res_files = await fetch(`/code/${projectName}/${settings.script}`);
                const text_files = await res_files.text();
                let files = text_files.split('//FILE ');
                files.shift();
                files = files.map((part) => {
                    const name = part.split('\n')[0].trim();
                    const code = part.slice(name.length).trim();
                    return { name, code };
                });

                const res_exp = await fetch(`/code/${projectName}/explanation.html`);
                const explanation = await res_exp.text();

                setProject({ settings, files, explanation, params });

                setAllCode(files.map((f) => f.code).join('\n') + '\n');
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        if (!project.settings) fetchStuff();
    }, []);

    const runCode = (newCode) => {
        newCode += `\n console.log('run ${runCounter.current}')`;
        setAllCode(newCode);
        runCounter.current++;
    }
    const runParameters = () => {
        let newCode = ''
        project.files.forEach((f) => {
            newCode += f.code + '\n';
        })
        Object.entries(project.params).forEach(([key, param]) => {
            newCode += getCodeLine(key,param)
        })
        runCode(newCode)
    }

    return {
        project, allCode,
        runCode, runParameters
    }
}


function getCodeLine(key,param){
    if (param.type == 'range') return `${key} = [${param.value[0]},${param.value[1]}];\n`
    if (param.type == 'number') return `${key} = ${param.value};\n`
    if (param.type == 'color') return `${key} = '${param.value}';\n`
    if (param.type == 'boolean') return `${key} = ${param.value};\n`
    if (param.type == 'expression') return `${key} = ${param.value};\n`
    if (param.type == 'string') return `${key} = '${param.value}';\n`

    if (param.type == 'array'){
        if (param.subtype == 'color') return `${key} = ['${param.value.join("','")}'];\n`
    }

}