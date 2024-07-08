import Project from "../Project";
import Question from "../Question";

export default function GalacticPistol(props){
    return (
        <Project img="galacticpistol.webp" background='#ccc' {...props}>
            <h2>Galactic Pistols</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}