import { useRecoilValue } from "recoil"
import useProject from "../utils/useProject"
import { topBarAtom } from "./Tabs"

export default function Variations(){
    const projectData = useProject()
    const topBarState = useRecoilValue(topBarAtom)

    if (topBarState.main !== 'variations') return null

    const clickHandler = (v) => {
        projectData.runVariation(v)
    }

    return (
        <>
            {projectData.project.settings.variations.map((v, i) => (
                <div key={i} onClick={() => clickHandler(v)} style={{ padding: '10px', cursor: 'pointer' }}>
                    {v.name}
                </div>
            ))}
        </>
    )
}