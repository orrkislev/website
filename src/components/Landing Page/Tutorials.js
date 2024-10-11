import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { getGithubUrl, useFileManager } from '../../utils/useFileManager'
import { useNavigate } from 'react-router-dom'

export default function TutorialsSection() {
    const thisRef = useRef(null)
    const [tutorials, setTutorials] = useState([
        { name: 'Fake 3D Circles', directory: 'ellipse' },
    ])
    const fileManager = useFileManager()

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            if (data.tutorials)
                setTutorials(data.tutorials)
        })
    }, [])

    return (
        <section className="p-8" ref={thisRef}>
            <h2 className="text-3xl font-bold mb-4">TUTORIALS</h2>
            <div className="flex flex-wrap gap-4">
                {tutorials.map(tutorial => (
                    <TutorialLink key={tutorial} tutorial={tutorial} />
                ))}
            </div>
        </section>
    )
}


const TutorialContainer = styled.div`
flex:1;
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

const TutorialBackground = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(${props => getGithubUrl(props.$project, 'thumb.png')});
    background-size: ${props => props.$hover ? '110%' : '100%'};
    background-position: center;
    transition: all 0.3s ease;
    `

const TutorialText = styled.div`
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

function TutorialLink({ tutorial }) {
    const [hover, setHover] = useState(false)
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/tutorial/${tutorial.directory}`)
    }

    return (
        <TutorialContainer onClick={() => handleClick()} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <TutorialBackground $project={'tutorial_' + tutorial.directory} $hover={hover} />
            <TutorialText $hover={hover}>
                {tutorial.name}
            </TutorialText>
        </TutorialContainer>
    )
}