import { useRecoilValue } from "recoil"
import useProject from "../utils/useProject"
import { topBarAtom } from "./Tabs"
import styled from "styled-components"
import { useState } from "react"

const Variation = styled.div`
    padding: 10px;
    padding-right: 50px;
    cursor: pointer;
    border-radius: 10px;
    background-color: ${props => props.isActive ? 'white' : '#333'};
    color: ${props => props.isActive ? 'black' : 'white'};
    transition: all 0.2s;
    &:hover {
        background-color: ${(props) => (props.isactive ? "#555" : "white")};
        color: ${(props) => (props.isactive ? "#888" : "#8C8C8C")};
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
                        isActive={currVariation === v.name ? 1 : 0}
                    >
                        {v.name}
                    </Variation>
                ))}
            </VariationsContainerInner>
        </VariationsContainerOuter>
    )
}