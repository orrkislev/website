import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { LogoSVG } from './HomeLogo';
import { useRecoilState } from 'recoil';
import { atom } from "recoil";

export const topBarAtom = atom({
  key: "topBarState", default: {
    main: 'parameters',
    info: true,
    debug: false
  }
});

const TopBarContainer = styled.div`
    position: fixed;
    top: 1em;
    left: 1em;
    right: 1em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: 999;
    align-items: center;
`;

const TopBarButtons = styled.div`
    display: flex;
    flex-direction: row;
    background: white;
    font-size: .8em;
`;

const TopBarButton = styled.div`
    cursor: pointer;
    padding: 0.5em 1em;
    color: ${props => props.$active ? 'white' : 'gray'};
    background-color: ${props => props.$active ? 'black' : 'transparent'};
    transition: color 0.5s;
`;

const LogoContainer = styled(Link)`
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
    padding: 0.5em;
    border-radius: 999px;
    box-shadow: 0px 0px 0px 0px black;
    transition: box-shadow 0.5s;
    border: 2px solid transparent;
    cursor: pointer;
    color: black;
    text-decoration: none;

    &:hover {
        background-color: white;
        border: 2px solid black;
        box-shadow: 10px 10px 0px 0px black;
    }
`;


export default function TopBar() {
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)

    // useEffect(() => {
        // const timeout = setTimeout(() => click(topBarState.main), 1000)
        // return () => clearTimeout(timeout)
    // }, [topBarState.main])

    const click = (name) => {
        setTopBarState(prev => ({ ...prev, scrollTo: name }))
    }

    return (
        <TopBarContainer>
            <LogoContainer to="/">
                <LogoSVG width="20px" height="20px" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: 800, lineHeight: '8px' }}>Stuff I Made For You</div>
                    <div style={{ fontSize: '11px' }}>by Orr Kislev</div>
                </div>
            </LogoContainer>
            <TopBarButtons>
                <TopBarButton $active={topBarState.main === 'info'} onClick={() => click('info')}>LEARN</TopBarButton>
                <TopBarButton $active={topBarState.main === 'params'} onClick={() => click('params')}>PLAY</TopBarButton>
                <TopBarButton $active={topBarState.main === 'editor'} onClick={() => click('editor')}>STUDY</TopBarButton>
                <TopBarButton $active={topBarState.main === 'variations'} onClick={() => click('variations')}>EXPLORE</TopBarButton>
            </TopBarButtons>
        </TopBarContainer>
    )
}