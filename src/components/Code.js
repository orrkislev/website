import styled from "styled-components";
import SketchFrame from './SketchFrame';
import useProject from '../utils/useProject';
import Editor from './Editor';
import { EditorTabs, LibraryTabs, MainTabs, topBarAtom } from "./Tabs";
import { useRecoilValue } from "recoil";

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #34352F;
  height: 3em;
  align-items: center;
  justify-content: space-between;
`

const RunButton = styled.button`
  background-color: #74C991;
  color: #34352F;
  padding: 10px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.2s;
  position: absolute;
  bottom: 25px;
  right: 25px;
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

    if (topBarState.main === 'parameters') {
      const model = allModels.find((m) => m.uri.path === '/params');
      projectData.runParameters(model.getValue());
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <TopBar>
        <EditorTabs />
        <MainTabs />
        <LibraryTabs />
      </TopBar>

      <div style={{ position: 'relative', height: '100%' }}>
        <FullScreen style={{ zIndex: 10 }}>
          <SketchFrame />
        </FullScreen>

        <FullScreen style={{ zIndex: 20 }}>
          <Editor />
        </FullScreen>

        <RunButton onClick={updateCode}>Run Code</RunButton>

      </div>
    </div>
  )
}