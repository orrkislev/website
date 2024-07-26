import { atom, useRecoilState } from "recoil";
import styled from "styled-components";

const InfoDiv = styled.div`
  justify-self: end;
  margin-right: 2em;
  cursor: pointer;
  border-radius: 999px;
  border: 2px solid black;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const topBarAtom = atom({
  key: "topBarState", default: {
    main: 'parameters',
    info: false,
    debug: false
  }
});

export function LibraryTabs() {
  const [topBarState, setTopBarState] = useRecoilState(topBarAtom);

  const clickInfo = () => {
    setTopBarState({ ...topBarState, info: !topBarState.info })
  }

  return (
    <InfoDiv onClick={clickInfo}>
      <div style={{ fontFamily: 'serif', fontSize: '18px' }}>
        i
      </div>
    </InfoDiv>
  )
}

