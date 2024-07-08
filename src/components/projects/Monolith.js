import Project from "../Project";
import Question from "../Question";

export default function Monolith(props){
    return (
        <Project img="monolith.png" background='#aaa' {...props}>
            <h2>MONOLITH</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}