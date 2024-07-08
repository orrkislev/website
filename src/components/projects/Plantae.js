import Project from "../Project";
import Question from "../Question";

export default function Plantae(props){
    return (
        <Project img="plantae.webp" background='#ccc' {...props}>
            <h2>Plantae</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}