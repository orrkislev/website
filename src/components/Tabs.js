import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import styled, { css, keyframes } from "styled-components";

export const topBarAtom = atom({
  key: "topBarState", default: {
    main: 'parameters',
    info: true,
    debug: false
  }
});


const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

const InfoDiv = styled.div`
  justify-self: end;
  margin-right: 2em;
  cursor: pointer;
  border-radius: 999px;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.2s;

  border: 2px solid black;
  background-color: ${props => props.$isactive ? 'black' : 'white'};
  color: ${props => props.$isactive ? 'white' : 'black'};

  &:hover {
    background-color: ${props => props.$isactive ? 'white' : 'black'};
    color: ${props => props.$isactive ? 'black' : 'white'};
  }

  ${props => props.$isactive && props.$ispulsing && css`
    animation: ${pulse} 1s infinite;
  `}
`;

export function InfoButton() {
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    let interval;
    if (topBarState.info) {
      interval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [topBarState.info]);

  const clickInfo = () => {
    setTopBarState({ ...topBarState, info: !topBarState.info })
  }

  return (
    <InfoDiv onClick={clickInfo} $isactive={topBarState.info ? 1 : 0} $ispulsing={isPulsing ? 1 : 0}>
      <div style={{ fontFamily: 'serif', fontSize: '18px' }}>
        i
      </div>
    </InfoDiv>
  )
}

