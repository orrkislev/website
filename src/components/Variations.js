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

    background-color: ${props => props.$isactive ? 'black' : 'white'};
    color: ${props => props.$isactive ? 'white' : 'black'};
    transition: all 0.2s;

    &:hover {
        background-color: ${(props) => (props.$isactive ? "white" : "black")};
        color: ${(props) => (props.$isactive ? "black" : "white")};
    }
`

const VariationsContainerOuter = styled.div`
    display: flex;
    flex-direction: row;
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
        <VariationsContainerOuter >
            <VariationsContainerInner>
                {projectData.project.settings.variations.map((v, i) => (
                    <Variation key={i}
                        onClick={() => clickHandler(v)} style={{ padding: '10px', cursor: 'pointer' }}
                        $isactive={currVariation === v.name ? 1 : 0}
                    >
                        {v.name}
                    </Variation>
                ))}
            </VariationsContainerInner>
        </VariationsContainerOuter>
    )
}