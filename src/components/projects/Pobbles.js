import Project from "../Project";
import Question from "../Question";

export default function Pobbles(props){
    return (
        <Project img="pobbles.png" background='#aaa' {...props}>
            <h2>Pobbles</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}