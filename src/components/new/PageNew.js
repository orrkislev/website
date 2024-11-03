import { RecoilRoot } from "recoil";
import ProjectNew from "./ProjectNew";
import { useParams } from "react-router-dom";

export default function ProjectPageNew(props) {
    const { name } = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'

    return (
        <RecoilRoot>
            <ProjectNew name={name} />
        </RecoilRoot>
    )
}