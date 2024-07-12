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
    margin-right: 1em;
    `;

export default function Explanation() {
    const topBarState = useRecoilValue(topBarAtom)
    const projectState = useRecoilValue(projectAtom)

    if (!topBarState.info) return null;

    return (
        <ExplanationContainer dangerouslySetInnerHTML={{ __html: projectState.explanation }} />
    )
}