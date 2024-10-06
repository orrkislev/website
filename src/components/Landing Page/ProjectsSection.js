import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getGithubUrl, useFileManager } from '../../utils/useFileManager'
import { useLocation, useNavigate } from 'react-router-dom'
import usePatreon from '../../utils/usePatreon'


export default function ProjectsSection() {
    const location = useLocation();
    const patreon = usePatreon()
    const [projects, setProjects] = useState([])
    const [tags, setTags] = useState({})
    const fileManager = useFileManager()
    const navigate = useNavigate()
    const thisRef = useRef(null)

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            setProjects(data.projects)
            const tagNames = new Set(data.projects.map(project => project.tags).flat())
            const newTags = {}
            tagNames.forEach(tag => newTags[tag] = false)
            setTags(newTags)
        })
    }, [])

    useEffect(() => {
        if (location && location.hash === '#projects') 
            if (thisRef.current)
                thisRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [location])

    const goToProject = (project) => {
        navigate(`/${project}`)
    }

    const clickTag = (tag) => {
        const newTags = { ...tags }
        newTags[tag] = !newTags[tag]
        setTags(newTags)
    }

    const activeTags = Object.keys(tags).filter(tag => tags[tag])
    let filteredProjects = projects
    if (activeTags.length > 0) filteredProjects = projects.filter(project => project.tags.some(tag => activeTags.includes(tag)))
    filteredProjects.reverse()

    return (
        <section className="p-8" ref={thisRef}>
            <h2 className="text-3xl font-bold mb-4">PROJECTS</h2>
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {Object.keys(tags).map(tag => (
                    <span key={tag} className={`${tags[tag] ? 'bg-blue-300 hover:bg-blue-600' : 'bg-stone-200 hover:bg-stone-400'} px-2 py-1 rounded-full cursor-pointer`}
                        onClick={() => clickTag(tag)}
                    >
                        {tag.toLowerCase()}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {filteredProjects.map(project => (
                    <ProjectLink
                        key={project.directory}
                        project={project}
                        disabled={project.locked && !patreon.gotAccess}
                        click={() => goToProject(project.directory)}
                    />
                ))}
            </div>
            <h2 className="text-2xl mb-4 font-light text-nowrap text-stone-700 text-center mt-8">
            New experiments added regularly
             </h2>
        </section>
    )
}





const ProjectContainer = styled.div`
    position: relative;
    cursor: pointer;
    min-width: 200px;
    height: 10em;
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
        -45deg,
        #00000000,
        #00000000 6px,
        #ffffff88 6px,
        #ffffff88 9px
    );
    transition: all 0.3s ease;
`;

function ProjectLink({ project, disabled, click }) {
    const [hover, setHover] = useState(false)

    const handleClick = () => {
        if (disabled) window.open('https://www.patreon.com/orrkislev', '_blank')
        else click()
    }

    return (
        <ProjectContainer onClick={() => handleClick()} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <ProjectBackground $project={project.directory} $hover={hover} />
            {disabled && <ProjectDisabled2 $hover={hover} />}
            {disabled && <ProjectDisabled $hover={hover}>Patrons Only</ProjectDisabled>}
            <ProjectText $hover={hover}>
                {project.name}
            </ProjectText>
        </ProjectContainer>
    )
}