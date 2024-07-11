import styled from "styled-components";
import SketchFrame from './SketchFrame';
import useProject from '../utils/useProject';
import Editor from './Editor';
import { EditorTabs, LibraryTabs, topBarAtom } from "./Tabs";
import { useRecoilValue } from "recoil";
import Params from "./Params";
import Variations from "./Variations";
import MainBtns from "./MainBtns";

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  background-color: white;
  border-bottom: 2px solid black;
  padding: 0 1em;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const RunButton = styled.button`
  background-color: white;
  color: #34352F;
  padding: 5px 50px;
  cursor: pointer;
  border: 2px solid black;
  font-size: 16px;
  font-weight: bold;
  border-radius: 999px;
  transition: all 0.2s;
  position: absolute;
  top: 1em;
  left: 50%;
  transform: translateX(-50);
  z-index: 100;
  &:hover {
    background-color: black;
    color: white;
  } 
`;

export default function Code() {
  const projectData = useProject()
  const topBarState = useRecoilValue(topBarAtom)

  if (!projectData.project.files) return null;

  const updateCode = () => {
    const allModels = monaco.editor.getModels();

    if (topBarState.main === 'code') {
      let allCode = ''
      projectData.project.files.forEach((f) => {
        const model = allModels.find((m) => m.uri.path === '/' + f.name);
        allCode += model.getValue() + '\n';
      })
      projectData.runCode(allCode);
    }

    if (topBarState.main === 'parameters') projectData.runParameters();
    if (topBarState.main === 'variations') projectData.rerun()
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <TopBar>
        <EditorTabs />
        <MainBtns />
        <LibraryTabs />
      </TopBar>

      <div style={{ position: 'relative', height: '100%' }}>
        <FullScreen style={{ zIndex: 10 }}>
          <SketchFrame />
        </FullScreen>

        <FullScreen style={{ zIndex: 20 }}>
          <Editor />
          <Params />
          <Variations />
        </FullScreen>
        


        {topBarState.main == 'code' &&  <RunButton onClick={updateCode}>RUN</RunButton>}

      </div>
    </div>
  )
}