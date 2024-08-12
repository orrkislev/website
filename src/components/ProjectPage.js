import { useParams } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Project from "./__project";

export default function ProjectPage() {
    const { name } = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'
    console.log('ProjectPage', name, document.title)

    return (
        <RecoilRoot>
            <Project name={name} />
        </RecoilRoot>
    )
}