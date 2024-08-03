import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { projectAtom } from "../utils/useProject";
import Section from "./__Section";

const ExplanationContainer = styled.div`
    user-select: none;
    display: flex;
    gap: 1em;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: end;
    `;

const ExpTitleCard = styled.div`
    width: 50%;
    border-radius: 16px;
    padding: 1em;
    color: #2F242C;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
    `;

const ExpTitleTitle = styled.div`
    font-size: 40pt;
    font-weight: bold;
    font-family: "Noto Serif", serif;
    `;
const ExpTitleSubtitle = styled.div`
    font-size: 20pt;
    font-family: "Noto Serif", serif;
    `;

const ExpCard = styled.div`
    width: 30%;
    border-radius: 16px;
    padding: 1em;
    color: #2F242C;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
    `;
    
const ExpCardTitle = styled.div`
    font-size: 14pt;
    font-weight: bold;
    `;
const ExpCardSubtitle = styled.div`
    font-size: 12pt;
    `;
const ExpCardContent = styled.div` 
    font-size: 11pt;
    `;


export default function Explanation() {
    const projectState = useRecoilValue(projectAtom)

    const exp = projectState.explanation
    return (
        <Section name='info'>
            <ExplanationContainer>
                {exp.title && (
                    <ExpTitleCard>
                        <ExpTitleTitle>{exp.title}</ExpTitleTitle>
                        <ExpTitleSubtitle>{exp.subtitle}</ExpTitleSubtitle>
                    </ExpTitleCard>
                )}
                {exp.cards && exp.cards.map((card, i) => (
                    <ExpCard key={i}>
                        <ExpCardTitle>{card.title}</ExpCardTitle>
                        <ExpCardSubtitle>{card.subtitle}</ExpCardSubtitle>
                        <ExpCardContent dangerouslySetInnerHTML={{ __html: card.content }} />
                    </ExpCard>
                ))}


            </ExplanationContainer>
        </Section>
    )
}