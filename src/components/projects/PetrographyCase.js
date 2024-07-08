import Project from "../Project";
import Question from "../Question";

export default function PetrographyCase(props){
    return (
        <Project img="petrography.png" background='#ccc' {...props}>
            <h2>The Petrography Case</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}