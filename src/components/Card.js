import styled from "styled-components";
import Chatter from "./Chatter";

const CardDiv = styled.div`
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: sticky;
    top: 50px;
`;

const Avatar = styled.img`
    border-radius: 9999px;
    border: 5px solid white;
    width: 100px;
    height: 100px;
    box-shadow: 1px 2px 10px rgba(0,0,0,0.4)
    align-self: center;
`;

const CardHeader = styled.h1`
    font-size: 2.5em;
    margin: 0;
    margin-top: -.5em;
    text-align: center;
    font-family: 'Roboto', sans-serif;
`;


const CardBody = styled.div`
    margin-top: 1em;
    align-self: stretch;
`;

export default function Card(props){
    return (
        <CardDiv>
            <Avatar src='./avatar.jpg' />
            <CardHeader>Hi, I am Orr</CardHeader>
            <CardBody>
                <Chatter />
            </CardBody>
        </CardDiv>
    );
}