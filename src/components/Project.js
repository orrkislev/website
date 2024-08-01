import styled from "styled-components";
import SketchFrame from './SketchFrame';
import useProject from '../utils/useProject';
import Editor from './Editor';
import { InfoButton, topBarAtom } from "./Tabs";
import { useRecoilState } from "recoil";
import Params from "./Params";
import Variations from "./Variations";
import MainBtns from "./MainBtns";
import { useEffect } from "react";
import Explanation from "./Explanation";
import HomeLogo from "./HomeLogo";
import RunBtn from "./RunBtn";

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  background-color: white;
  border-bottom: 2px solid black;
  padding: .2em 1em;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: auto;
`




export default function Project({ name }) {
  const projectData = useProject()
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  useEffect(() => {
    projectData.reset()
    projectData.initProject(name);
  }, [])

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

  const clickDebug = () => {
    setTopBarState({ ...topBarState, debug: !topBarState.debug })
    updateCode()
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <TopBar>
        <HomeLogo />
        <MainBtns />
        <InfoButton />
      </TopBar>

      <div style={{ position: 'relative', height: '100%' }}>
        <FullScreen style={{ zIndex: 10 }}>
          <SketchFrame />
        </FullScreen>

        <FullScreen style={{ zIndex: 20 }}>
          {topBarState.main == 'code' && <Editor />}
          {topBarState.main == 'parameters' && <Params />}
          {topBarState.main == 'variations' && <Variations />}
          {topBarState.info && <Explanation />}
        </FullScreen>


        {topBarState.main == 'code' && (
          <RunBtn clickRun={updateCode} clickDebug={clickDebug} />
        )}
      </div>
    </div>
  )
}

