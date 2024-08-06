import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { useOnScreen } from '../utils/useOnScreen';
import { useRecoilState } from 'recoil';
import { topBarAtom } from "./__TopBar";

export const SectionEl = styled.section`
    position: relative;
    min-height: 80vh;
    margin: 2em 5em;
    user-select: none;
    scroll-margin-top: 10vh;
    `;

export default function Section({ name, children }) {
    const sectionRef = useRef(null)
    const onScreen = useOnScreen(sectionRef)
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)

    useEffect(() => {
        if (onScreen) setTopBarState(prev => ({ ...prev, main: name }))
    }, [onScreen])

    useEffect(() => {
        if (topBarState.scrollTo === name) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [topBarState.scrollTo])

    return (
        <SectionEl ref={sectionRef}>
            {children}
        </SectionEl>
    )
}