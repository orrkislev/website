import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { useRecoilValue, atom, useRecoilState } from 'recoil';
import useProject, { projectAtom } from '../utils/useProject';
import { ApplyDecoration, ApplyHoverProvider, monacoOptions } from '../utils/monacoStuff';
import './__Editor.css';
import styled from "styled-components";
import Section from "./__Section";

const EditorContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: .5em;
    grid-template-rows: repeat(5, 1fr);
    margin: 1em;
`;

const EditorCard = styled.div`
    height: 80vh;
    grid-column: ${props => props.$index % 2 + 1} / span 1;
    grid-row: ${props => props.$index * 2 + 1} / span 3;
    display: flex;
    flex-direction: column;
    border-radius: 1em;
    margin-bottom: 5em;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
`;

const EditorCardHeader = styled.div`
    padding: 1em 2em;
`;
const EditorCardHeaderTitle = styled.h2`
    font-size: 1.5em;
    margin: 0;
    font-family: "Noto Serif", serif;

`;
const EditorCardHeaderDescription = styled.div`
    font-size: 1em;
`;

export default function Editor() {
    const project = useProject()
    const editors = useRef([])
    const codeParts = useRef()

    useEffect(() => {
        if (project.project.files) {
            codeParts.current = project.project.files.map((f) => f.content)
        }
    }, [project.project.files])

    const setEditor = (i, editor) => {
        editors.current[i] = editor
        codeParts.current[i] = editor.getValue()
    }

    const updateCode = (i, value) => {
        codeParts.current[i] = value
        project.setAllCode(codeParts.current.join('\n'))
    }

    return (
        <Section name='editor'>
            <EditorContainer>
                {project.project.files && project.project.files.map((f, i) => (
                    <EditorCard key={f.name} $index={i}>
                        <EditorCardHeader>
                            <EditorCardHeaderTitle>{f.title || f.name}</EditorCardHeaderTitle>
                            <EditorCardHeaderDescription>{f.description}</EditorCardHeaderDescription>
                        </EditorCardHeader>
                        <EditorSection code={f.content} updateEditor={(editor) => setEditor(i, editor)} updateCode={(value) => updateCode(i, value)} />
                    </EditorCard>
                ))}
            </EditorContainer>
        </Section>
    )
}

function EditorSection({ code, updateEditor, updateCode }) {
    const projectState = useRecoilValue(projectAtom)
    const monaco = useMonaco()
    const editorRef = useRef(null)

    useEffect(() => {
        const initMonaco = async () => {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                await fetch('/code/p5.global-mode.d.ts').then(response => response.text()),
                'p5.d.ts'
            );

            //     monaco.languages.register({ id: 'p5js' });

            //     monaco.languages.setMonarchTokensProvider('p5js', {
            //         tokenizer: {
            //             root: [
            //                 [/\b(createCanvas|background|fill|ellipse|rect|line)\b/, 'p5jsKeyword'], // More specific p5js keywords
            //                 [/\b(function|var|let)\b/, 'keyword'],
            //                 // ... more rules for other token types
            //             ]
            //         }
            //     });

            //     monaco.editor.defineTheme('p5jsTheme', {
            //         base: 'vs',
            //         inherit: true,
            //         rules: [
            //             { token: 'p5jsKeyword', foreground: '0000FF' }, // Custom token type for p5js keywords
            //             { token: 'keyword', foreground: 'FF00FF' },
            //         ],
            //         colors: {
            //             'editor.foreground': '#000000'
            //         }
            //     });
        }
        if (monaco) initMonaco()
    }, [monaco])

    const initEditor = (editor) => {
        editorRef.current = editor;
        ApplyDecoration(editorRef.current, Object.keys(projectState.snippets), 'helperFunctionHighlight');
        ApplyDecoration(editorRef.current, ['debugMode'], 'debugModeHighlight');
        ApplyHoverProvider(monaco, projectState.snippets);
        updateEditor(editorRef.current);
    }

    if (!projectState) return null
    if (!monaco) return null
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: '1em', overflow: 'hidden' }}>
            <MonacoEditor
                defaultValue={code}
                onMount={initEditor}
                options={monacoOptions}
                onChange={updateCode}
            />
        </div>
    )
}