import { useEffect, useState } from "react";
import { useEvents } from "../utils/events";
import styled from "styled-components";

export default function Chatter(props) {
    const [texts, setTexts] = useState([{ key: 0, text: 'Hi there! this is a website! /n I made it by coding it' }]);

    const events = useEvents(event => {
        if (event.type == 'poll') {
            setTexts([{
                key: texts.length,
                text: event.text, type: event.type
            }, ...texts]);
        }
    });

    console.log(texts)

    return texts.map((text, i) => {
        if (text.type == 'poll') {
            return (<ChatterPoll key={text.key} text={text.text} alpha={1 - i / texts.length} />);
        } else {
            return (<ChatterText key={text.key} text={text.text} alpha={1 - i / texts.length} />);
        }
    })
}


const ChatterTextDiv = styled.div`
    margin-top: 1em;
    padding-bottom: 1em;
    border-bottom: 1px dashed #ccc;
    max-width: 100%;
`

function ChatterText(props) {
    const [words, setWords] = useState(props.words || props.text.split(' '));
    const [shown, setShown] = useState(0);

    if (shown < words.length) {
        setTimeout(() => {
            setShown(shown + 1);
        }, Math.random() * 150 + 60);
    }

    return (
        <ChatterTextDiv style={{ opacity: props.alpha }} >
            <div>
                {words.slice(0, shown).map(word=>(<span>{word} </span>))}
            </div>
            <div>{props.children}</div>
        </ChatterTextDiv>
    );
}

function ChatterPoll(props) {

    const click = (answer) => {
        console.log(answer)
    }

    return (
        <ChatterText text={props.text}>
            <button onClick={() => click('yes')}>Yes</button>
            <button onClick={() => click('no')}>No</button>
        </ChatterText>
    );
}