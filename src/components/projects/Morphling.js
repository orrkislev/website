import Project from "../Project";
import Question from "../Question";

export default function Morphling(props){
    return (
        <Project img="morphling.png" background='#ccc' {...props}>
            <h2>Morphling</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}