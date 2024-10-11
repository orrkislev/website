import { useMonaco } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { EditorContainer, EditorSection } from "./__Editor";
import { RecoilRoot } from "recoil";
import useProject from "../utils/useProject";
import { useEffect, useRef, useState } from "react";
import SketchFrame from "./SketchFrame";
import { setupMonaco } from "../utils/monacoStuff";
import { Logo } from "./UserContentPage";
import ExpandingLogo, { FloatingExpandingLogo } from "./Logo";

export default function TutorialPage() {
    return (
        <RecoilRoot>
            <TutorialPageActual />
        </RecoilRoot>
    )
}

function TutorialPageActual(props) {
    const { name } = useParams();
    const project = useProject()
    const currLevel = useRef(0)
    const [currDesc, setCurrDesc] = useState('')

    useEffect(() => {
        project.reset()
        project.initProject("tutorial_" + name, false, false)
    }, [])

    useEffect(() => {
        if (Object.keys(project.project).length > 0)
            project.loadTutorialLevel(0).then(desc => {
                setCurrDesc(desc.html)
            })
    }, [project.project])

    if (project.runningCode.length == 0) return null;

    const nextLevel = () => {
        currLevel.current = currLevel.current + 1
        project.loadTutorialLevel(currLevel.current).then(desc => {
            setCurrDesc(desc.html)
        })
    }

    const prevLevel = () => {
        currLevel.current = currLevel.current - 1
        project.loadTutorialLevel(currLevel.current).then(desc => {
            setCurrDesc(desc.html)
        })
    }

    if (!project.project.settings) return null

    const canGoBack = currLevel.current > 0
    const canGoForward = currLevel.current < project.project.settings.levels.length - 1

    return (
        <div style={{ paddingBottom: '90vh' }}>
            <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
                <SketchFrame />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '80vh', paddingTop: '20em', opacity: focus ? 1 : 0.5 }}>
                {canGoBack && (
                    <div onClick={prevLevel} disabled={!canGoBack} className="text-5xl text-white font-bold" style={{ zIndex: 100, cursor: 'pointer', marginTop: '-10em' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="black" />
                            <polyline points="25,10 15,20 25,30" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                )}
                <TutorialEditor desc={currDesc} />
                {canGoForward && (
                    <div onClick={nextLevel} className="text-5xl text-white font-bold" style={{ zIndex: 100, cursor: 'pointer', marginTop: '-10em' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="black" />
                            <polyline points="15,10 25,20 15,30" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                )}
            </div>
            <FloatingExpandingLogo />
        </div>
    )
}

function TutorialEditor({ desc }) {
    const monaco = useMonaco()
    const [currCode, setCurrCode] = useState('')
    const project = useProject()
    const editorRef = useRef(null)
    const [focus, setFocus] = useState(false)

    useEffect(() => {
        if (monaco) setupMonaco(monaco)
    }, [monaco])

    useEffect(() => {
        if (project.allCode) setCurrCode(project.allCode)
        if (editorRef.current) {
            editorRef.current.setValue(project.allCode)
            const numOfLines = editorRef.current.getModel().getLineCount();
            const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);
            const totalHeight = (numOfLines + 2) * lineHeight;
            editorRef.current.layout({ height: totalHeight });
        }
    }, [project.allCode])

    useEffect(() => {
        const timeout = setTimeout(() => {
            // if (currCode != project.allCode)
            project.updateTutorialCode(currCode)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [currCode, project.allCode])

    const htmlLines = []
    const lines = desc.split('\n')
    lines.forEach((line, index) => {
        if (!line.endsWith('>')) htmlLines.push(line + '</br>')
        else htmlLines.push(line)
    })
    const html = htmlLines.join('\n')

    return (
        <EditorSection
            monaco={monaco}
            code={currCode}
            updateEditor={(e) => editorRef.current = e}
            updateCode={(v) => setCurrCode(v)}
            html={html}
            index={0}
            side='left'
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            width={70}
        />
    )
}