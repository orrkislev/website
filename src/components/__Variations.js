import useProject from "../utils/useProject"
import styled from "styled-components"
import { useState } from "react"
import Section from "./__Section"

const VariationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5em;
    padding: .8em 1.2em;
    background: white;
    border-radius: 10px;
    margin: 5px;
    width: 100%;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
`;


const Variation = styled.div`
    padding: 10px;
    padding-right: 50px;
    cursor: pointer;
    text-align: center;

    font-size: 1.2em;
    font-family: "Noto Serif", serif;

    background-color: ${props => props.$isactive ? 'black' : 'white'};
    color: ${props => props.$isactive ? 'white' : 'black'};
    transition: all 0.2s;

    &:hover {
        background-color: ${(props) => (props.$isactive ? "white" : "black")};
        color: ${(props) => (props.$isactive ? "black" : "white")};
    }
`

export default function Variations() {
    const project = useProject()
    const [currVariation, setCurrVariation] = useState('default')

    const clickHandler = (v) => {
        setCurrVariation(v.name)
        project.applyVariation(v)
    }

    const variations = [...project.project.variations]
    variations.unshift({ name: 'original' })

    return (
        <Section name="variations">
            <h3 style={{margin:'0 2em'}}>EXPLORE different variations</h3>
            <VariationsContainer>
            {variations.map((v, i) => (
                <div key={i}>
                    <Variation
                        onClick={() => clickHandler(v)} style={{ padding: '10px', cursor: 'pointer' }}
                        $isactive={currVariation === v.name ? 1 : 0}>
                        {v.name}
                    </Variation>
                    {currVariation == v.name && <div style={{ fontSize: '0.8em', marginLeft: '10px', maxWidth: "16em" }}>{v.text}</div>}
                </div>
            ))}
            </VariationsContainer>
        </Section>
    )
}