import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { editorModelsAtom, projectAtom } from '../utils/useProject';
import styled from 'styled-components';

const options = {
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: true,
    wordWrap: 'on',
    tabSize: 2,
    fontSize: 14,
    libraries: {
        include: [
            '/code/p5.global-mode.d.ts'
        ]
    },
};


export default function Editor() {
    const projectState = useRecoilValue(projectAtom)
    const [editorModels, setEditorModels] = useRecoilState(editorModelsAtom)
    const monaco = useMonaco()
    const editorRef = useRef(null)
    const [tabs, setTabs] = useState([])
    const [currentTab, setCurrentTab] = useState('')
    const hoverDisposable = useRef(null)

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
        if (monaco && editorModels) {
            const newTabs = []
            const allModels = monaco.editor.getModels();

            const savedModelsNum = Object.keys(editorModels).length
            console.log('loading: savedModelsNum', savedModelsNum, 'monaco:', allModels.length)
            if (savedModelsNum != 0 && editorModels && savedModelsNum == allModels.length) return
            if (savedModelsNum == 0) {
                console.log('loading from projectState')
                projectState.files.forEach((f) => {
                    const model = allModels.find((m) => m.uri.path === '/' + f.name);
                    if (!model) monaco.editor.createModel(f.code, 'javascript', monaco.Uri.parse('/' + f.name), options);
                    newTabs.push(f.name)
                })
            } else {
                console.log('loading from editorModels')
                Object.entries(editorModels).forEach(([path, code]) => {
                    const model = allModels.find((m) => m.uri.path === '/' + path);
                    if (!model) monaco.editor.createModel(code, 'javascript', monaco.Uri.parse('/' + path), options);
                    newTabs.push(path)
                })
            }
            setTabs(newTabs)
            setCurrentTab(newTabs[0])
        }

        return () => {
            if (monaco) {
                const currModels = monaco.editor.getModels()
                const modelsToSave = {}
                currModels.forEach((m) => {
                    const trimmedPath = m.uri.path.slice(1)
                    modelsToSave[trimmedPath] = m.getValue()
                })
                setEditorModels(modelsToSave)
            }
        }
    }, [monaco, editorModels])

    useEffect(() => {
        if (monaco && editorRef.current && projectState.snippets) ApplySnippets(editorRef.current, monaco, projectState.snippets)
    }, [currentTab, monaco, editorRef])

    const initEditor = (editor, monaco) => {
        editorRef.current = editor;
        ApplySnippets()
    }

    const ApplySnippets = () => {
        const editor = editorRef.current;
        const model = editor.getModel();
        const snippets = projectState.snippets;
        
        // Function to find all occurrences of helper functions
        const findHelperFunctions = () => {
            let decorations = [];
            Object.keys(snippets).forEach(funcName => {
                const matches = model.findMatches(funcName, false, false, true, null, true);
                matches.forEach(match => {
                    decorations.push({
                        range: match.range,
                        options: {
                            inlineClassName: 'helperFunctionHighlight'
                        }
                    });
                });
            });
            return decorations;
        };
    
        // Apply decorations
        let decorations = [];
        const updateDecorations = () => {
            decorations = editor.deltaDecorations(decorations, findHelperFunctions());
        };
    
        // Initial decoration
        updateDecorations();
    
        // Update decorations on content change
        model.onDidChangeContent(() => {
            updateDecorations();
        });
    
        // Add hover provider
        if (hoverDisposable.current) hoverDisposable.current.dispose();
        hoverDisposable.current = monaco.languages.registerHoverProvider('javascript', {
            provideHover: (model, position) => {
                const word = model.getWordAtPosition(position);
                if (word && snippets[word.word]) {
                    return {
                        contents: [
                            { value: '### Helper Function', isTrusted: true },
                            { value: '```javascript\n' + snippets[word.word] + '\n```', isTrusted: true }
                        ]
                    };
                }
            }
        });
    }

    if (!monaco) return null;

    const model = monaco.editor.getModels().find((m) => m.uri.path === '/' + currentTab);
    if (!model) return null


    return (
        <>
            <EditorTabs tabs={tabs} onChange={newTab => setCurrentTab(newTab)} current={currentTab} />
            <MonacoEditor
                width="100%"
                height="100%"
                path={currentTab}
                onMount={initEditor}
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
                .helperFunctionHighlight{
                    background-color: #CCC !important;
                    text-decoration: underline;
                }
            `}</style>
        </>

    )
}






// --------------------
// ------- TABS -------
// --------------------

const EditorTabContainer = styled.div`
  display: flex;
  background:white;
  flex-direction: row;
  gap: 8px;
  padding: 3px 1em;
`;

const EditorTab = styled.div`
  display: inline-block;
  padding: 6px 12px;
  color: ${(props) => (props.$isactive ? "black" : "#8C8C8C")};
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: ${(props) => (props.$isactive ? "2px solid black" : "2px solid #CCC")};
  &:hover {
    color: ${(props) => (props.$isactive ? "black" : "#8C8C8C")};
    border: 2px solid black;
  }
`;

function EditorTabs(props) {
    return (
        <EditorTabContainer>
            {props.tabs.map((tab, i) => (
                <EditorTab key={i} onClick={() => props.onChange(tab)}
                    $isactive={props.current === tab ? 1 : 0}>
                    {tab}
                </EditorTab>
            ))}
        </EditorTabContainer>
    )
}







