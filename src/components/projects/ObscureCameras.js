import Project from "../Project";
import Question from "../Question";

export default function ObscureCameras(props){
    return (
        <Project img="obscurecameras.png" background='#aaa' {...props}>
            <h2>Obscure Cameras</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}