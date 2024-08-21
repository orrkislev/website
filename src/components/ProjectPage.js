import { useParams } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Project from "./__project";

export default function ProjectPage() {
    const { name } = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'

    return (
        <RecoilRoot>
            <Project name={name} />
        </RecoilRoot>
    )
}

export function VariationPage() {
    const { name, variation} = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'

    return (
        <RecoilRoot>
            <Project name={name} variation={variation} />
        </RecoilRoot>
    )
}