import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, atom, useRecoilState } from 'recoil';
import useProject, { projectAtom } from '../utils/useProject';
import { ApplyDecoration, ApplyHoverProvider, monacoOptions, setupMonaco } from '../utils/monacoStuff';
import './__Editor.css';
import styled from "styled-components";
import Section from "./__Section";
import RevertIcon from '../assets/revert.svg';
import { topBarAtom } from './__TopBar';

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em;
    padding-top: 20em;
`;


const EditorCardHeader = styled.div`
    padding: 1em 2em;
`;
const EditorCardHeaderTitle = styled.h2`
    font-size: 1.5em;
    margin: 0;
`;
const EditorCardHeaderDescription = styled.div`
    font-size: 1em;
`;

export default function Editor() {
    const project = useProject()
    const editors = useRef([])
    const codeParts = useRef()
    const monaco = useMonaco()
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)
    const numEdits = useRef(0)
    const [sideInFocus, setSideInFocus] = useState(null)

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
        if (numEdits.current++ == 10) setTopBarState({ ...topBarState, publish: true });
        project.setAllCode(codeParts.current.join('\n'))
    }

    let widths = [50,50]
    if (sideInFocus == 'left') widths = [65, 35]
    if (sideInFocus == 'right') widths = [35, 65]

    return (
        <Section name='editor' title="STUDY the code">
            <EditorContainer>
                {project.project.files && project.project.files.map((f, i) => (
                    f.hidden ? null :
                        <EditorSection key={i}
                            index={i}
                            side={i % 2 === 0 ? 'left' : 'right'}
                            width={widths[i % 2]}
                            monaco={monaco}
                            code={f.content}
                            updateEditor={(editor) => setEditor(i, editor)}
                            updateCode={(value) => updateCode(i, value)}
                            title={f.title ? f.title.replace('_', ' ') : f.name.replace('_', ' ')}
                            notes={f.notes}
                            description={f.description}
                            onFocus={(side) => setSideInFocus(side)}
                            onBlur={(side) => {
                                if (side === sideInFocus) setSideInFocus(null)
                            }}
                        />
                ))}
            </EditorContainer>
        </Section>
    )
}



const EditorCard = styled.div`
    margin-top: -20em;
    width: calc(50% - .5em);
    align-self: ${props => props.$index % 2 === 0 ? 'flex-start' : 'flex-end'};
    width: ${props => props.$index % 2 === 0 ? '80%' : '20%'};
    display: flex;
    flex-direction: column;
    border-radius: 1em;
    margin-bottom: 5em;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    transition: 0.2s;
`;

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

const EditorNotes = styled.div`
    font-family: "Caveat", cursive;
    font-size: 1.5em;
    margin: 1em;

    position: absolute;
    top: -5em;
    `
const EditorNote = styled.div`
    background: rgba(255, 255, 255);
    transform: rotate(${props => props.$angle}deg);
    `


function EditorSection({ monaco, code, updateEditor, updateCode, title, description, index, notes, side, onFocus, onBlur, width }) {
    const project = useProject()
    const editorRef = useRef(null)
    const [changed, setChanged] = useState(false)
    const [dot, setDot] = useState(false)
    const [initialCode, setInitialCode] = useState(code)
    const [focus, setFocus] = useState(false)

    useEffect(() => {
        if (project.project.files && editorRef.current) {
            code = project.project.files[index].content
            editorRef.current.setValue(code)
            setInitialCode(code)
            setChanged(false)
            setDot(false)
            setEditorSize()
        }
    }, [project.project.files])

    useEffect(() => {
        setDot(false)
    }, [project.runningCode])

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

    const handleFocus = () => {
        setFocus(true)
        onFocus(side)
    }
    const handleBlur = () => {
        setFocus(false)
        onBlur(side)
    }

    if (!monaco) return null
    let editorWidth = 50
    if (project.project.files.length === 1) editorWidth = 100
    if (width) editorWidth = width
    editorWidth = `calc(${editorWidth}% - .5em)`
    return (
        <EditorCard $index={index} style={{ width: editorWidth }} onFocus={handleFocus} onBlur={handleBlur}>
            <EditorCardHeader>
                <EditorCardHeaderTitle>{title}</EditorCardHeaderTitle>
                <EditorCardHeaderDescription>{description} </EditorCardHeaderDescription>
                {changed && <Revert src={RevertIcon} style={{ cursor: 'pointer', position: 'absolute', top: '1em', right: '1em' }} onClick={revert} />}
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
            {focus && notes && <EditorNotes>
                {notes.map(note => (
                    <EditorNote $angle={Math.random() * 10 - 5}>{note}</EditorNote>
                ))}
            </EditorNotes>}
        </EditorCard>
    )
}