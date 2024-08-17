import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import useProject, { projectAtom } from "../utils/useProject";
import Section from "./__Section";
import { topBarAtom } from "./__TopBar";

const ExplanationContainer = styled.div`
    user-select: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .8em;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: end;
    margin-bottom: 1em;
    `;

const ExpTitleCard = styled.div`
    // width: 50%;
    border-radius: 12px;
    padding: .8em;
    color: #2F242C;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
    `;

const ExpTitleTitle = styled.div`
    font-size: 30pt;
    font-weight: bold;
    font-family: "Noto Serif", serif;
    margin-bottom: -0.3em;
    `;
const ExpTitleSubtitle = styled.div`
    font-size: 20pt;
    font-family: "Noto Serif", serif;
    `;

const ExpCard = styled.div`
    border-radius: 11px;
    padding: .6em 1em;
    color: #2F242C;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
    ${props => props.$isFirst ? `
        width: 70%;
    ` : `
        width: 70%;
        grid-column: 1 / 2;
    `}
    `;

const ExpCardTitle = styled.div`
    font-size: 11pt;
    font-weight: bold;
    `;
const ExpCardSubtitle = styled.div`
    font-size: 10pt;
    font-style: italic;
    `;
const ExpCardContent = styled.div` 
    font-size: 9pt;
    `;
const DebugButton = styled.button`
    cursor: pointer;
    padding: 0.5em 1em;
    color: ${props => props.$active ? 'white' : 'black'};
    background: ${props => props.$active ? 'black' : 'white'};
    transition: color 0.5s;
    border:none;

    &:hover {
        background: black;
        color: white;
    }
    `;

export default function Explanation() {
    const project = useProject()
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)


    const clickDebug = () => {
        setTopBarState({ ...topBarState, debug: !topBarState.debug })
        project.rerunParameters()
    }

    const exp = project.project.explanation
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
                    <ExpCard key={i} $isFirst={i === 0}>
                        <ExpCardTitle>{card.title}</ExpCardTitle>
                        <ExpCardSubtitle>{card.subtitle}</ExpCardSubtitle>
                        <ExpCardContent dangerouslySetInnerHTML={{ __html: card.content }} />
                    </ExpCard>
                ))}
            </ExplanationContainer>
            {/* <div>
                <DebugButton $active={topBarState.debug} onClick={clickDebug}>TECHNIQUE SPOTLIGHT</DebugButton>
            </div> */}
        </Section>
    )
}