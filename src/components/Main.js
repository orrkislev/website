import { Link } from "react-router-dom";
import styled from "styled-components";
import { useFileManager } from "../utils/useFileManager";
import { useEffect, useState } from "react";

const MainContainer = styled.div`
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


export default function Main() {
    const [projects, setProjects] = useState([])
    const fileManager = useFileManager()

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            setProjects(data.projects)
        })
    }, [])

    return (
        <MainContainer>
            <MainTitle>
                <div><h4>this is</h4></div>
                <div><h1>STUFF I MADE FOR YOU</h1></div>
                <div><h2>by Orr Kislev</h2></div>
            </MainTitle>
            {projects.map(project => (
                <div>
                    <MainLink to={"/"+project.directory}>{project.name}</MainLink>
                </div>
            ))}
        </MainContainer>
    )
}