import { useEffect } from "react"
import useProject from "../../utils/useProject"
import SketchFrame from "../SketchFrame"
import SideBar from "./SideBar"
import Discover from "./Discover"
import Play from "./Play"
import Study from "./Study"
import { FloatingExpandingLogo } from "../Logo"
import RunButton from "./RunButton"
import Explore from "./Explore"
import useAccessControl from "../../utils/accessControl"


export default function ProjectNew({ name }) {
    const projectData = useProject()
    const initAccessControl = useAccessControl()

    useEffect(() => {
        projectData.reset()
        projectData.initProject(name)
        initAccessControl(name)
    }, [name])
    if (!projectData.project.files) return null;

    return (
        <>
            <div style={{ position:'fixed', top:0, left:0, width: '100%', height: '100%', zIndex: 0 }}>
                <SketchFrame />
            </div>
            <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1, display: 'flex' }}>
                <SideBar />
                <div style={{ width: '100%', height: '100%', zIndex: 1 }}>
                    <Discover />
                    <Play />
                    <Study />
                    <Explore />
                </div>
            </div>
            <RunButton />
            <FloatingExpandingLogo />
        </>
    )
}