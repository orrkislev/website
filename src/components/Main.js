import { Link } from "react-router-dom";
import styled from "styled-components";
import { useFileManager } from "../utils/useFileManager";
import { useEffect, useState } from "react";

const MainContainer = styled.div`
    position: fixed;
    width: 100%;
    margin-top: 10em;
    padding: 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
    background: pink;
`;
const MainTitle = styled.h1`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
`;
const MainLink = styled(Link)`
    padding: 8px 16px;
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
    color: black;
    text-decoration: none;
    padding: 8px 16px;
    border: 2px solid black;
    border-radius: 999px;
    transition: all 0.3s ease;

    &:hover {
        background: black;
        color: white;
    }
`;

const Thisis = styled.div`
    font-size: 16px;
    margin-bottom: -.5em;
`;
const STUFF = styled.div`
    font-size: 56px;
    font-weight: bold;
    font-family: "Noto Serif", serif;
`;
const ByOrr = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-top: -.5em;
`;


export default function Main() {
    const [projects, setProjects] = useState([])
    const fileManager = useFileManager()

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            setProjects(data.projects)
        })
    }, [])

    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backdropFilter:'saturate(1000)' }}></div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backdropFilter:'saturate(0)' }}></div>
            <MainContainer>
                <MainTitle>
                    <Thisis>this is</Thisis>
                    <STUFF>STUFF I MADE FOR YOU</STUFF>
                    <ByOrr>by Orr Kislev</ByOrr>
                </MainTitle>
                {projects.map(project => (
                    <div>
                        <MainLink to={"/" + project.directory}>{project.name}</MainLink>
                    </div>
                ))}
            </MainContainer>

            <style jsx>{`
                body {
                    background-image: url("https://picsum.photos/1920/1080");
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            `}</style>
        </>
    )
}