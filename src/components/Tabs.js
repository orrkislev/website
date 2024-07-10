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






export function EditorTabs() {
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

  if (topBarState.main == 'variations') {
    return (
      <TabContainer>
        <Tab>variations</Tab>
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
      <Tab onClick={() => setTopBarState({ ...topBarState, main: 'variations', editor: 'params' })}
        isactive={topBarState.main === 'variations' ? 1 : 0}>Variations</Tab>
      <Tab onClick={() => setTopBarState({ ...topBarState, main: 'clean', editor: 'params' })}
        isactive={topBarState.main === 'clean' ? 1 : 0}>Clean</Tab>
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

