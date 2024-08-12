import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getGithubUrl, useFileManager } from "../utils/useFileManager";
import { useEffect, useState } from "react";
import usePatreon from "../utils/usePatreon";
import Patreon from "./Patreon";

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
    const patreon = usePatreon()
    const [projects, setProjects] = useState([])
    const fileManager = useFileManager()
    const navigate = useNavigate()

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            setProjects(data.projects)
        })
    }, [])

    const goToProject = (project) => {
        navigate(`/${project}`)
    }

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

                <Patreon />

                <LinksContainer>
                    {projects.map(project => {
                        let func = () => goToProject(project.directory)
                        const disabled = project.locked && !patreon.gotAccess
                        if (disabled) func = () => alert('You need to be a patron to access this project')
                        return (
                            <ProjectLink
                                key={project.directory}
                                project={project}
                                disabled={disabled}
                                click={func}
                            />
                        )
                    })}
                </LinksContainer>
            </MainContainer>

            <style>{`
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






const ProjectContainer = styled.div`
    position: relative;
    cursor: pointer;
    min-width: 200px;
    height: 6em;
    box-shadow: 2px 5px 10px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    border-radius: 5px;
    overflow: hidden;
    &:hover {
        transform: scale(1.05);
    }
`;

const ProjectBackground = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(${props => getGithubUrl(props.$project, 'thumb.png')});
    background-size: ${props => props.$hover ? '110%' : '100%'};
    background-position: center;
    transition: all 0.3s ease;
    `

const ProjectText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Noto Serif", serif;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: ${props => props.$hover ? 'white' : 'black'};
    transition: all 0.3s ease;
`

const ProjectDisabled = styled.div`
    position: absolute;
    width: 100%;
    height: 1.5em;
    padding: .1em .4em;
    background: crimson;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    color: white;
    font-weight: bold;
    transition: all 0.3s ease;
    transform: ${props => props.$hover ? 'translateY(0%)' : 'translateY(-150%)'};
`
const ProjectDisabled2 = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        -30deg,
        #00000000,
        #00000000 4px,
        #00000088 4px,
        #00000088 8px
    );
    transition: all 0.3s ease;
`;

function ProjectLink({ project, disabled, click }) {
    const [hover, setHover] = useState(false)

    return (
        <ProjectContainer onClick={click} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <ProjectBackground $project={project.directory} $hover={hover} />
            {disabled && <ProjectDisabled2 $hover={hover} />}
            {disabled && <ProjectDisabled $hover={hover}>Patrons Only</ProjectDisabled>}
            <ProjectText $hover={hover}>
                {project.name}
            </ProjectText>
        </ProjectContainer>
    )
}