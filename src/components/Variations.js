import { useRecoilValue } from "recoil"
import useProject from "../utils/useProject"
import { topBarAtom } from "./Tabs"
import styled from "styled-components"
import { useState } from "react"

const Variation = styled.div`
    padding: 10px;
    padding-right: 50px;
    cursor: pointer;
    border-radius: 999px;
    border: 2px solid black;
    text-align: center;
    min-width: 6em;
    max-width: 16em;

    background-color: ${props => props.$isactive ? 'black' : 'white'};
    color: ${props => props.$isactive ? 'white' : 'black'};
    transition: all 0.2s;

    &:hover {
        background-color: ${(props) => (props.$isactive ? "white" : "black")};
        color: ${(props) => (props.$isactive ? "black" : "white")};
    }
`

const VariationsContainerInner = styled.div`
    margin: 5px;
    display: flex;
    flex-direction: column;
    gap: 3px;
`

export default function Variations() {
    const projectData = useProject()
    const topBarState = useRecoilValue(topBarAtom)
    const [currVariation, setCurrVariation] = useState('default')

    if (topBarState.main !== 'variations') return null

    const clickHandler = (v) => {
        setCurrVariation(v.name)
        projectData.runVariation(v)
    }

    return (
        <VariationsContainerInner>
            {projectData.project.settings.variations.map((v, i) => (
                <div key={i}>
                    <Variation
                        onClick={() => clickHandler(v)} style={{ padding: '10px', cursor: 'pointer' }}
                        $isactive={currVariation === v.name ? 1 : 0}
                    >
                        {v.name}
                    </Variation>
                    {currVariation == v.name && <div style={{ fontSize: '0.8em', marginLeft: '10px', maxWidth: "16em" }}>{v.text}</div>}
                </div>
            ))}
        </VariationsContainerInner>
    )
}