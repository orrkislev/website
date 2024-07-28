import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { topBarAtom } from "./Tabs";
import { projectAtom } from "../utils/useProject";

const ExplanationContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 20em;
    height: 100%;
    margin: 1em;
    user-select: none;
    margin-top: ${props => props.$stepdown ? '3em' : '0em'};
    transition: all 1s;
    `;

export default function Explanation() {
    const topBarState = useRecoilValue(topBarAtom)
    const projectState = useRecoilValue(projectAtom)

    if (!topBarState.info) return null;

    return (
        <ExplanationContainer dangerouslySetInnerHTML={{ __html: projectState.explanation }} $stepdown={topBarState.main == 'code' ? 1 : 0} />
    )
}