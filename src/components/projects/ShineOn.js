import Project from "../Project";
import Question from "../Question";

export default function ShineOn(props){
    return (
        <Project img="shineon.png" background='#aaa' {...props}>
            <h2>Shine On</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}