import styled from "styled-components";
import SketchFrame from './SketchFrame';
import useProject from '../utils/useProject';
import Editor from './Editor';
import { LibraryTabs, MainTabs, topBarAtom } from "./Tabs";
import { useRecoilValue } from "recoil";
import Params from "./Params";
import Variations from "./Variations";

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #34352F;
  padding: 0 1em;
  height: 3em;
  align-items: center;
  justify-content: space-between;
`

const RunButton = styled.button`
  background-color: #74C991;
  color: #34352F;
  padding: 10px 20px;
  box-shadow: 0px 0px 10px 0px #00000055;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: bold;
  border-radius: 999px;
  transition: all 0.2s;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 100;
  &:hover {
    background-color: #34352F;
    color: #74C991;
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
        <MainTabs />
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
        


        <RunButton onClick={updateCode}>RUN</RunButton>

      </div>
    </div>
  )
}