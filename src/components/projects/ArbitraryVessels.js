import Project from "../Project";
import Question from "../Question";

export default function ArbitraryVessels(props){
    return (
        <Project img="vessels.webp" background='#ccc' {...props}>
            <h2>Arbitrary Vessels</h2>
            <Question text="How did I get this idea?" />
            <Question text="How does beautiful friendship renders so cool?" />
            <Question text="How do the blobs in beautiful friendship inflate so nicely?" />
        </Project>
    )
}