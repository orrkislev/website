import { useParams } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Project from "./Project";

export default function ProjectPage() {
    const { name } = useParams();


    return (
        <RecoilRoot>
            <Project name={name} />
        </RecoilRoot>
    )
}