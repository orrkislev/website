import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { EditorTabs, topBarAtom } from './Tabs';
import { projectAtom } from '../utils/useProject';

const options = {
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    fontSize: 14,
    libraries: {
        include: [
            '/code/p5.global-mode.d.ts'
        ]
    },
};

export default function Editor({ files }) {
    const projectState = useRecoilValue(projectAtom)
    const monaco = useMonaco()
    const topBarState = useRecoilValue(topBarAtom)
    const editorRef = useRef(null)
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        const setupMonaco = async () => {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                await fetch('/code/p5.global-mode.d.ts').then(response => response.text()),
                'p5.d.ts'
            );
        }
        if (monaco) setupMonaco();
    }, [monaco])

    useEffect(() => {
        if (monaco) {
            const allModels = monaco.editor.getModels();
            if (topBarState.main == 'code') {
                projectState.files.forEach((f) => {
                    const model = allModels.find((m) => m.uri.path === '/' + f.name);
                    if (!model) monaco.editor.createModel(f.code, 'javascript', monaco.Uri.parse('/' + f.name), options);
                })
            }
            setRerender(!rerender);
        }
    }, [monaco, topBarState.main])


    if (!monaco) return null;

    if (topBarState.main !== 'code') return null;

    let path = topBarState.main == 'code' ? topBarState.editor : 'params';
    const model = monaco.editor.getModels().find((m) => m.uri.path === '/' + path);
    if (!model) path = 'placeholder'


    return (
        <>
            <EditorTabs />
            <MonacoEditor
                width="100%"
                height="100%"
                path={path}
                onMount={(editor) => editorRef.current = editor}
                options={options}
            />
            <style jsx="true">{`
                .current-line {
                    background-color: #ffffffaa;
                    border: none;
                }
                .monaco-editor, .monaco-editor-background {
                background-color: transparent !important;
                }
                .monaco-editor {
                    --vscode-editor-selectionBackground: #74C991 !important;
                    --vscode-editorGutter-background: transparent !important;
                }
                .view-line span{
                    background-color: white;
                }
                .mtk8{
                    background-color: #4B8A6A !important;
                    color: white;
                }
            `}</style>
        </>

    )
}