import { useEffect, useRef } from "react";
import useProject from '../utils/useProject';
import SketchFrame from './SketchFrame';

import Editor from './__Editor';
import Params from "./__params";
import Variations from "./__Variations";
import Explanation from "./__explanation";
import TopBar from './__TopBar';
import RunBtn from './__RunBtn';
import PopUp from "./PopUp";


export default function Project({ name, variation }) {
  const projectData = useProject()
  const shouldLoadVariation = useRef(variation)

  useEffect(() => {
    projectData.reset()
    projectData.initProject(name, variation ? false : true)
  }, [])

  useEffect(() => {
    if (shouldLoadVariation.current && projectData.project.variations) {
      projectData.applyVariation(variation + '.js')
      shouldLoadVariation.current = false
    }
  }, [projectData.project.variations])

  if (!projectData.project.files) return null;

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
        <SketchFrame />
      </div>

      <div style={{ zIndex: 10, marginTop: '10vh', marginBottom: '100vh' }}>
        <Explanation />
        <Params />
        <Editor />
        <Variations />
      </div>

      <TopBar />
      <RunBtn />
      <PopUp />
    </ >
  )
}

