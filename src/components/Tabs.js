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



const EditorTabContainer = styled.div`
  display: flex;
  background:white;
  flex-direction: row;
  gap: 3px;
  padding-left: 10px;
  padding-right: 100px;
  margin-bottom: 10px;
`;

const EditorTab = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background-color: ${(props) => (props.isactive ? "white" : "#34352F")};
  color: ${(props) => (props.isactive ? "black" : "#8C8C8C")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${(props) => (props.isactive ? "white" : "#444")};
    color: ${(props) => (props.isactive ? "black" : "#8C8C8C")};
  }
`;

export function EditorTabs() {
  const projectState = useRecoilValue(projectAtom)
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  useEffect(() => {
    if (projectState.files.length) setTopBarState({ ...topBarState, editor: projectState.files[0].name })
  }, [projectState.files])

  if (topBarState.main == 'code') {
    return (
      <EditorTabContainer>
      {projectState.files.map((f, i) => (
        <EditorTab key={i} onClick={() => setTopBarState({ ...topBarState, editor: f.name })}
        isactive={topBarState.editor === f.name ? 1 : 0}>
        {f.name}
        </EditorTab>
      ))}
      </EditorTabContainer>
    )
  }

  return null
}

const MainTab = styled.div`
  display: inline-block;
  margin: 0 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background-color: ${(props) => (props.isactive ? "white" : "#444")};
  color: ${(props) => (props.isactive ? "black" : "#8C8C8C")};
  font-size: 18px;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    background-color: ${(props) => (props.isactive ? "white" : "#555")};
    color: ${(props) => (props.isactive ? "#666" : "#8C8C8C")};
  }
`;

export function MainTabs() {
  const projectState = useRecoilValue(projectAtom)
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  return (
    <TabContainer>
      <MainTab onClick={() => setTopBarState({ ...topBarState, main: 'parameters', editor: 'params' })}
        isactive={topBarState.main === 'parameters' ? 1 : 0}>PLAY</MainTab>

      <MainTab onClick={() => setTopBarState({ ...topBarState, main: 'code', editor: projectState.files[0].name })}
        isactive={topBarState.main === 'code' ? 1 : 0}>WORK</MainTab>

      <MainTab onClick={() => setTopBarState({ ...topBarState, main: 'variations', editor: 'params' })}
        isactive={topBarState.main === 'variations' ? 1 : 0}>EXPLORE</MainTab>
    </TabContainer>
  )
}

export function LibraryTabs() {
  const projectData = useProject()

  const save = () => {
    const allModels = monaco.editor.getModels();
    let allCode = ''
    projectData.project.files.forEach((f) => {
      const model = allModels.find((m) => m.uri.path === '/' + f.name);
      allCode += model.getValue() + '\n';
    })
    // download the code as a js file
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(allCode));
    element.setAttribute('download', 'sketch.js');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

  }

  return (
    <TabContainer>
      <Tab>Matter</Tab>
      <Tab>p5</Tab>
      <Tab onClick={save}>Save</Tab>
    </TabContainer>
  )
}

