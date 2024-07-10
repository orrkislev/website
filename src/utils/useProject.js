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

                const params = Object.entries(settings.params)
                    .map(([key, value]) => {
                        if (Array.isArray(value)) {
                            return `${key} = [${value.map(item =>
                                typeof item === 'string' ? `"${item}"` : item
                            ).join(', ')}]`;
                        } else if (typeof value === 'string') {
                            return `${key} = "${value}"`;
                        } else {
                            return `${key} = ${value}`;
                        }
                    })
                    .join('\n');

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
    const runParameters = (newParams) => {
        let newCode = ''
        project.files.forEach((f) => {
            newCode += f.code + '\n';
        })
        newCode += newParams;
        // Object.entries(newParams).forEach(([key, value]) => {
        //     newCode += `${key} = ${value}\n`
        // })
        runCode(newCode)
    }

    return {
        project, allCode,
        runCode, runParameters
    }
}