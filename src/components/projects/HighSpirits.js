import Project from "../Project";
import Question from "../Question";

export default function HighSpirits(props){
    return (
        <Project img="highspirits.png" background='#aaa' {...props}>
            <h2>High Spirits!</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}