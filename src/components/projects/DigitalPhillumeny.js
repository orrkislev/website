import Project from "../Project";
import Question from "../Question";

export default function DigitalPhillumeny(props){
    return (
        <Project img="phillumeny.webp" background='#ccc' {...props}>
            <h2>Digital Phillumeny</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}