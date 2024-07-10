import { useEffect } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import useProject, { projectAtom } from "../utils/useProject";

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
`;
const Tab = styled.div`
  display: inline-block;
  padding: 1em 10px;
  background-color: ${(props) => (props.isactive ? "white" : "#34352F")};
  color: ${(props) => (props.isactive ? "black" : "#8C8C8C")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

export const topBarAtom = atom({
  key: "topBarState", default: {
    main: 'parameters',
    editor: 'placeholder',
  }
});






export function EditorTabs({ files }) {
  const projectState = useRecoilValue(projectAtom)
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  useEffect(() => {
    if (projectState.files.length) setTopBarState({ ...topBarState, editor: projectState.files[0].name })
  }, [projectState.files])

  if (topBarState.main == 'code') {
    return (
      <TabContainer>
        {projectState.files.map((f, i) => (
          <Tab key={i} onClick={() => setTopBarState({ ...topBarState, editor: f.name })}
            isactive={topBarState.editor === f.name ? 1 : 0}>
            {f.name}
          </Tab>
        ))}
      </TabContainer>
    )
  } 

  if (topBarState.main == 'parameters') {
    return (
      <TabContainer>
        <Tab>params</Tab>
      </TabContainer>
    )
  }

  return null
}

export function MainTabs() {
  const projectState = useRecoilValue(projectAtom)
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  return (
    <TabContainer>
      <Tab onClick={() => setTopBarState({ ...topBarState, main: 'code', editor: projectState.files[0].name })}
        isactive={topBarState.main === 'code' ? 1 : 0}>Code</Tab>
      <Tab onClick={() => setTopBarState({ ...topBarState, main: 'parameters', editor: 'params' })}
        isactive={topBarState.main === 'parameters' ? 1 : 0}>Parameters</Tab>
    </TabContainer>
  )
}

export function LibraryTabs() {
  return (
    <TabContainer>
      <Tab>Matter</Tab>
      <Tab>p5</Tab>
    </TabContainer>
  )
}

