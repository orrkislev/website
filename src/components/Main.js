import { Link } from "react-router-dom";
import styled from "styled-components";

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
    background: pink;
`;
const MainTitle = styled.h1`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
`;
const MainLink = styled(Link)`
    padding: 8px 16px;
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
    color: black;
    text-decoration: none;
    padding: 8px 16px;
    border: 2px solid black;
    border-radius: 999px;
    transition: all 0.3s ease;

    &:hover {
        background: black;
        color: white;
    }
`;


export default function Main() {
    return (
        <MainContainer>
            <MainTitle>
                <div><h4>this is</h4></div>
                <div><h1>STUFF I MADE FOR YOU</h1></div>
                <div><h2>by Orr Kislev</h2></div>
            </MainTitle>
            <div>
                <MainLink to="/thingies">Friendly Thingies</MainLink>
            </div>

            <div>
                <MainLink to="/marbling">Marbling</MainLink>
            </div>

            <div>
                <MainLink to="/growth">Growth</MainLink>
            </div>
        </MainContainer>
    )
}