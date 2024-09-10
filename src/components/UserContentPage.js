import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import SketchFrame, { JSLibs } from "./SketchFrame"
import useProject from "../utils/useProject"
import { RecoilRoot } from "recoil"
import { getFromFirebase, useFileManager } from "../utils/useFileManager"
import { LogoSVG } from "./HomeLogo"
import { styled } from 'styled-components'

const LogoContainer = styled(Link)`
    position: fixed;
    z-index: 100;
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

    useEffect(() => {
        project.initProject(name, false, false).then(() => {
            project.loadUserContent(name, hash)
        })
    }, [name, hash])

    if (!project.project.settings) return null

    return (
        <div>
            <Logo />
            <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
                <SketchFrame />
            </div>
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