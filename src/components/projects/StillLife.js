import Project from "../Project";
import Question from "../Question";

export default function StillLife(props){
    return (
        <Project img="obscurecameras.png" background='#aaa' {...props}>
            <h2>Still Life</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}