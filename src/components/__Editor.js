import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, atom, useRecoilState } from 'recoil';
import useProject, { projectAtom } from '../utils/useProject';
import { ApplyDecoration, ApplyHoverProvider, monacoOptions, setupMonaco } from '../utils/monacoStuff';
import './__Editor.css';
import styled from "styled-components";
import Section from "./__Section";
import RevertIcon from '../assets/revert.svg';

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em;
    padding-top: 20em;
`;

const EditorCard = styled.div`
    margin-top: -20em;
    width: calc(50% - .5em);
    align-self: ${props => props.$index % 2 === 0 ? 'flex-start' : 'flex-end'};
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
    const monaco = useMonaco()

    useEffect(() => {
        if (monaco) setupMonaco(monaco)
    }, [monaco])

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
            <h3 style={{margin:'0 2em'}}>STUDY the code</h3>
            <EditorContainer>
                {project.project.files && project.project.files.map((f, i) => (
                    <EditorSection key={f.name}
                        index={i}
                        monaco={monaco}
                        code={f.content}
                        updateEditor={(editor) => setEditor(i, editor)}
                        updateCode={(value) => updateCode(i, value)}
                        title={f.title || f.name}
                        description={f.description}
                    />
                ))}
            </EditorContainer>
        </Section>
    )
}




const Revert = styled.img`
    cursor: pointer;
    position: absolute;
    top: 1em;
    right: 1em;
    width: 1.5em;
    height: 1.5em;
    padding: 0.5em;
    transition: 0.2s;

    &:hover {
        filter: invert(1);
        background: white;
    }
`;
const Dot = styled.div`
    background-color: red;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: absolute;
    top: 1.25em;
    right: -.25em;
`;


function EditorSection({ monaco, code, updateEditor, updateCode, title, description, index }) {
    const project = useProject()
    const editorRef = useRef(null)
    const [changed, setChanged] = useState(false)
    const [dot, setDot] = useState(false)
    const [initialCode, setInitialCode] = useState(code)

    useEffect(()=>{
        if (project.project.files && editorRef.current) {
            code = project.project.files[index].content
            editorRef.current.setValue(code)
            setInitialCode(code)
            setChanged(false)
            setDot(false)
            setEditorSize()
        }
    },[project.project.files])

    useEffect(()=>{
        setDot(false)
    },[project.runningCode])

    const initEditor = (editor) => {
        editorRef.current = editor;
        ApplyDecoration(editorRef.current, Object.keys(project.project.snippets), 'helperFunctionHighlight');
        ApplyDecoration(editorRef.current, ['debugMode'], 'debugModeHighlight');
        ApplyDecoration(editorRef.current, Object.keys(project.project.params), 'parameterHighlight');
        updateEditor(editorRef.current);
        ApplyHoverProvider(monaco, project.project.snippets);

        setEditorSize()
    }

    const setEditorSize = () => {
        const numOfLines = editorRef.current.getModel().getLineCount();
        const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);
        const totalHeight = numOfLines * lineHeight;
        editorRef.current.layout({ height: totalHeight });
    }

    const onChange = (value) => {
        updateCode(value)
        setChanged(true)
        setDot(true)
    }

    const revert = () => {
        editorRef.current.setValue(initialCode)
        setChanged(false)
    }

    if (!monaco) return null
    const shouldBeFullWidth = project.project.files.length === 1
    return (
        <EditorCard $index={index} style={{ width: shouldBeFullWidth ? '100%' : 'calc(50% - .5em)' }}>
            <EditorCardHeader>
                <EditorCardHeaderTitle>{title}</EditorCardHeaderTitle>
                <EditorCardHeaderDescription>{description} </EditorCardHeaderDescription>
                {changed && <Revert src={RevertIcon} style={{cursor: 'pointer', position: 'absolute', top: '1em', right: '1em'}} onClick={revert} />}
                {dot && <Dot />}
            </EditorCardHeader>
            <div style={{ width: '100%', height: '100%', borderRadius: '1em', overflow: 'hidden' }}>
                <MonacoEditor
                    language='creativeCode'
                    theme='creativeCodeTheme'
                    defaultValue={code}
                    onMount={initEditor}
                    options={monacoOptions}
                    onChange={onChange}
                />
            </div>
        </EditorCard>
    )
}