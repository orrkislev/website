import { Link } from "react-router-dom";
import styled from "styled-components";
import { getGithubUrl, useFileManager } from "../utils/useFileManager";
import { useEffect, useState } from "react";

const MainContainer = styled.div`
    position: fixed;
    width: 100%;
    margin-top: 10em;
    padding: 3em 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
    background: #999;
`;
const MainTitle = styled.h1`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
`;



const LinksContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1em;
    flex-wrap: wrap;
    justify-content: center;
`;
const MainLink = styled(Link)`
    cursor: pointer;

    font-family: "Noto Serif", serif;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: black;

    padding: 2.5em 1em;
    border: none;
    border-radius: 5px;

    transition: all 0.3s ease;

    background-image: url(${props => getGithubUrl(props.$project, 'thumb.png')});
    background-size: 100%;
    background-position: center;
    box-shadow: 2px 5px 10px 0 rgba(0, 0, 0, 0.2);

    min-width: 200px;

    &:hover {
        transform: scale(1.05);
        background-size: 110%;
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
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backdropFilter: 'saturate(1000)' }}></div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backdropFilter: 'saturate(0)' }}></div>
            <MainContainer>
                <MainTitle>
                    <Thisis>this is</Thisis>
                    <STUFF>STUFF I MADE FOR YOU</STUFF>
                    <ByOrr>by Orr Kislev</ByOrr>
                </MainTitle>
                <LinksContainer>
                    {projects.map(project => (
                            <MainLink to={"/" + project.directory} $project={project.directory}>
                                {project.name}
                            </MainLink>
                    ))}
                </LinksContainer>
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