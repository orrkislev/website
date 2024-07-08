import Project from "../Project";
import Question from "../Question";

export default function MajesticInscription(props){
    return (
        <Project img="majestic.png" background='#aaa' {...props}>
            <h2>Majestic Inscription</h2>
            <Question text="How did I get this idea?" />
            <Question text="What?! how?!" />
        </Project>
    )
}