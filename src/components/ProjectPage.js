import styled from "styled-components";
import SketchFrame from './SketchFrame';
import useProject from '../utils/useProject';
import Editor from './Editor';
import { LibraryTabs, topBarAtom } from "./Tabs";
import { useRecoilState, useRecoilValue } from "recoil";
import Params from "./Params";
import Variations from "./Variations";
import MainBtns from "./MainBtns";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Explanation from "./Explanation";
import HomeLogo from "./HomeLogo";

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
  overflow: auto;
`

const RunButtonContainer = styled.div`
  position: absolute;
  top: 1em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  border: 2px solid black;
  border-radius: 999px;
  background-color: black;
  gap: 2px;
  display:flex;
  min-width: 200px;
  align-items: center;
  overflow: hidden;
`
const RunButton = styled.button`
  flex:4;
  background-color: white;
  color: #34352F;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  border: none;
  padding: 5px;
  
  &:hover {
    background-color: black;
    color: white;
  } 
`;

const DebugButton = styled.button`
  flex:1;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background-color: ${(props) => (props.$isactive ? "black" : "white")};  
  &:hover {
    background-color: ${(props) => (props.$isactive ? "white" : "black")};
  } 
`;


export default function ProjectPage() {
  const { name } = useParams()
  const projectData = useProject()
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  useEffect(() => {
    if (!projectData.project.name || projectData.project.name !== name)
      projectData.initProject(name);
  }, [name, projectData])

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
        <LibraryTabs />
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
          <RunButtonContainer>
            <RunButton onClick={updateCode}>RUN</RunButton>
            <DebugButtonComp isActive={topBarState.debug} onClick={clickDebug} />
            {/* <DebugButton $isactive={topBarState.debug} onClick={clickDebug}>
              <img src={topBarState.debug ? bug_white : bug_black} style={{ width: '20px' }} />
            </DebugButton> */}
          </RunButtonContainer>
        )}
      </div>
    </div>
  )
}

function DebugButtonComp({ isActive, onClick }) {
  const [hover, setHover] = useState(false);
  const active = hover ? !isActive : isActive;
  return (
    <DebugButton $isactive={isActive} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 146.32 146.3" fill={active ? "white" : "black"} width="23" height="23">
        <path d="M146.32,79.74c-.95,2.47-2.78,3.33-5.37,3.3-7.43-.09-14.86-.03-22.29-.03-.56,0-1.13,0-1.85,0,0,2.85-.03,5.55.04,8.25,0,.26.61.65.99.73,8.31,1.84,14.48,6.52,18.47,14.02,1.81,3.41,2.79,7.07,2.89,10.94.06,2.28.09,4.57.03,6.86-.06,2.44-1.83,4.19-4.13,4.21-2.36.02-4.18-1.78-4.23-4.28-.08-3.66.29-7.36-.88-10.91-2.11-6.39-6.46-10.46-13.16-12.41.1,16.04-5.96,28.94-19.01,38.17-7.9,5.59-16.85,7.88-26.53,7.68-19.51-.39-42.92-17.8-41.91-45.74-3.23.69-5.93,2.27-8.26,4.51-3.89,3.73-5.6,8.4-5.66,13.72-.02,1.67.03,3.33-.02,5-.06,2.44-1.8,4.21-4.11,4.25-2.3.05-4.18-1.69-4.24-4.1-.14-5.58-.25-11.15,2.18-16.4,3.81-8.24,10.12-13.41,18.95-15.46.97-.22,1.35-.53,1.32-1.56-.07-2.42-.02-4.85-.02-7.43-.65-.03-1.2-.07-1.75-.07-7.48,0-14.96,0-22.43-.01-.85,0-1.74-.03-2.54-.28-1.82-.56-2.97-2.47-2.77-4.35.21-1.96,1.76-3.54,3.72-3.75.52-.06,1.05-.03,1.57-.03,7.48,0,14.96,0,22.43,0h1.66v-8.76c-.65-.15-1.37-.3-2.09-.48-11.48-2.84-19.81-13.09-20.21-24.89-.07-2.09-.07-4.19-.05-6.29.03-2.76,1.74-4.62,4.19-4.61,2.45,0,4.07,1.89,4.22,4.62.19,3.5.04,7.13.93,10.46,1.76,6.56,6.39,10.58,13.02,12.51.08-1.58.07-3.05.24-4.49.39-3.41,2.86-5.78,6.3-6.13.57-.06,1.14-.09,1.71-.09,9.86,0,19.72,0,29.58,0,.51,0,1.02,0,1.67,0,0,.74,0,1.3,0,1.86,0,15.43,0,30.87,0,46.3,0,.75.04,1.53.23,2.26.48,1.84,2.12,3.03,4.02,3.02,1.91,0,3.53-1.2,4-3.06.18-.73.22-1.51.22-2.26.01-15.43,0-30.87,0-46.3v-1.75c.58-.03,1-.08,1.42-.08,10.05,0,20.1-.02,30.15,0,4.96.01,7.78,2.87,7.83,7.82,0,.9,0,1.8,0,2.84,3.31-.74,6.03-2.29,8.36-4.52,3.94-3.77,5.66-8.47,5.71-13.85.01-1.62-.02-3.24.01-4.86.06-2.5,1.86-4.32,4.2-4.32,2.3,0,4.1,1.76,4.16,4.2.13,5.58.23,11.15-2.23,16.39-3.83,8.15-10.07,13.32-18.87,15.36-.41.09-.81.21-1.27.33v8.76h1.57c7.48,0,14.96.07,22.43-.04,2.58-.04,4.41.8,5.45,3.19v2Z" />
        <path d="M91.16,0c.71.53,1.54.95,2.11,1.6,1.18,1.34,1.26,2.91.53,4.53-1,2.25-1.98,4.51-2.86,6.49,2.47,1.28,4.98,2.24,7.11,3.75,4.7,3.33,7.11,8.08,7.4,13.83.13,2.52.02,5.04.02,7.68H40.9c-.22-6.26-.61-12.49,3.59-17.86,2.39-3.05,5.33-5.25,9.04-6.41.63-.2,1.25-.38,2.02-.62-.89-2.01-1.74-3.91-2.58-5.81C51.35,3.55,51.81,2.01,55.15,0h2c1.75.59,2.76,1.85,3.45,3.53,1.12,2.72,2.4,5.37,3.55,8.08.33.76.73,1.05,1.58,1.05,4.94-.04,9.89-.04,14.83,0,.85,0,1.26-.28,1.58-1.05,1.15-2.71,2.43-5.36,3.55-8.08C86.4,1.85,87.42.59,89.16,0,89.83,0,90.5,0,91.16,0Z" />
      </svg>
    </DebugButton>
  )
}