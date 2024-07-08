import Project from "../Project";
import Question from "../Question";

export default function Fxields(props){
    return (
        <Project img="fxields.png" background='#aaa' {...props}>
            <h2>F(x)ields</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}