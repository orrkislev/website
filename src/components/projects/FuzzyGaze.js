import Project from "../Project";
import Question from "../Question";

export default function FuzzyGaze(props){
    return (
        <Project img="fuzzygaze.png" background='#aaa' {...props}>
            <h2>Fuzzy Gaze</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}