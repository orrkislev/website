import styled from "styled-components";
import {HiQuestionMarkCircle} from 'react-icons/hi'
import { useEvents } from "../utils/events";

const QuestionDiv = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: .5em;
    font-size: .8em;

    transition: all .1s ease-in-out;
    border-radius: 9999px;

    &:hover {
        background-color: #fff;
        color: #000;
    }
`;

export default function Question(props){
    const event = useEvents()

    const click = () => {
        if (props.onClick){
            
        } else {
            const text = 'sorry, the page for "' + props.text + '" is not ready yet. /n Should I make it?'
            event.fire(text, 'poll');
        }
    }
    return (
        <QuestionDiv onClick={click}>
            <HiQuestionMarkCircle />
            {props.text}
        </QuestionDiv>
    );
}