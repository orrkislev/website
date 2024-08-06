import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { JSLibs } from "./SketchFrame"
import useProject from "../utils/useProject"
import { RecoilRoot } from "recoil"
import { getFromFirebase, useFileManager } from "../utils/useFileManager"
import { LogoSVG } from "./HomeLogo"
import { styled } from 'styled-components'

const LogoContainer = styled(Link)`
    position: fixed;
    top: 1.5em;
    left: 1.5em;
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
    padding: 0.5em;
    border-radius: 999px;
    box-shadow: 0px 0px 0px 0px black;
    transition: box-shadow 0.5s;
    border: 2px solid transparent;
    cursor: pointer;
    color: black;
    text-decoration: none;

    &:hover {
        background-color: white;
        border: 2px solid black;
        box-shadow: 10px 10px 0px 0px black;
    }
`;

export default function UserContentPage() {
    const { name, hash } = useParams()
    return (
        <RecoilRoot>
            <UserContent name={name} hash={hash} />
        </RecoilRoot>
    )
}

function UserContent({ name, hash }) {
    const project = useProject()
    const fileManager = useFileManager()
    const [running, setRunning] = useState(false)

    useEffect(() => {
        project.initProject(name, false, false)
    }, [name])

    useEffect(() => {
        if (!project.project.settings) return
        if (!fileManager) return
        setSketch()
    }, [project, fileManager])

    const setSketch = async () => {
        if (running) return
        const promises = []
        project.project.settings.libraries.forEach(lib => {
            const script = document.createElement('script')
            script.src = JSLibs[lib].cdn
            document.body.appendChild(script)
            promises.push(new Promise((resolve, reject) => {
                script.onload = () => resolve()
                script.onerror = () => reject()
            }))
        })

        await Promise.all(promises)

        let code = Object.values(project.project.snippets).join('\n') + '\n'
        code += await getFromFirebase(name, hash) + '\n'

        const script = document.createElement('script')
        script.innerHTML = code
        console.log(code)
        document.body.appendChild(script)
        eval('new p5()')
        setRunning(true)
    }

    return (
        <div>
            <Logo />
            <main />
        </div>
    )
}

export function Logo() {
    return (
        <LogoContainer to="/">
            <LogoSVG width="30px" height="30px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '16px', fontStyle: 'italic', fontWeight: 800, lineHeight: '8px' }}>Stuff I Made For You</div>
                <div style={{ fontSize: '12px' }}>by Orr Kislev</div>
            </div>
        </LogoContainer>
    )
}