import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { LogoSVG } from './HomeLogo';
import { useRecoilState, useRecoilValue } from 'recoil';
import { atom } from "recoil";
import { useEffect, useState } from 'react';
import useProject from '../utils/useProject';
import { AnimatePresence, motion } from 'framer-motion';

export const topBarAtom = atom({
    key: "topBarState", default: {
        main: 'parameters',
        info: true,
        debug: false,
        publish: false,
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
    align-items: start;
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
    transition: all 0.5s;
    border: 2px solid transparent;
    cursor: pointer;
    color: black;
    text-decoration: none;

    background: ${props => props.$fancy ? 'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)' : 'transparent'};

    &:hover {
        background-color: white;
        border: 2px solid black;
        box-shadow: 10px 10px 0px 0px black;
    }
`;

const RightSide = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: flex-end;
    align-items: end;
`;

const PublishButton = styled.div`
    cursor: pointer;
    padding: 0.5em 1em;
    color: white;
    font-size: .8em;
    background: linear-gradient(90deg, #FFC107 0%, #FF9800 100%);
    border-radius: 5px;
    transition: color 0.5s;
    animation: ${props => props.$loading ? 'pulse 1s infinite' : 'appearFromRight 0.5s'};

    &:hover {
        background: linear-gradient(90deg, #FF9800 0%, #FFC107 100%);
        color: black;
    }

    @keyframes pulse {
        0% {
            filter: brightness(100%) saturate(100%);
        }
        50% {
            filter: brightness(120%) saturate(120%);
        }
        100% {
            filter: brightness(100%) saturate(100%);
        }
    }

    @keyframes appearFromRight {
        0% {
            transform: translateX(300%);
        }
        100% {
            transform: translateX(0%);
        }
    }
`;

const MoreProjects = styled(motion.div)`
    padding: 0.5em 1em;
    border-radius: 5px;
    color: black;
    animation: pulse 4s infinite;
    fontSize: 14px; 
    fontStyle: italic; 
    fontWeight: 800; 
`;

export default function TopBar() {
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowMore(true)
        }, 1000)
    }, [])

    const click = (name) => {
        setTopBarState(prev => ({ ...prev, scrollTo: name }))
    }

    return (
        <TopBarContainer>
            <LogoContainer to="/" $fancy={showMore ? 1 : 0} onMouseLeave={()=>setShowMore(false)}>
                <LogoSVG width="20px" height="20px" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: 800, lineHeight: '8px' }}>Stuff I Made For You</div>
                    <div style={{ fontSize: '11px' }}>by Orr Kislev</div>
                </div>
                    {showMore && <MoreProjects
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}>
                        Check out more projects here
                    </MoreProjects>}
            </LogoContainer>

            <RightSide>
                <TopBarButtons>
                    <TopBarButton $active={topBarState.main === 'info'} onClick={() => click('info')}>LEARN</TopBarButton>
                    <TopBarButton $active={topBarState.main === 'params'} onClick={() => click('params')}>PLAY</TopBarButton>
                    <TopBarButton $active={topBarState.main === 'editor'} onClick={() => click('editor')}>STUDY</TopBarButton>
                    <TopBarButton $active={topBarState.main === 'variations'} onClick={() => click('variations')}>EXPLORE</TopBarButton>
                </TopBarButtons>
                <Publish />
            </RightSide>
        </TopBarContainer>
    )
}

function Publish() {
    const project = useProject()
    const [loading, setLoading] = useState(false)
    const topBarState = useRecoilValue(topBarAtom)

    const click = async () => {
        setLoading(true)
        await project.share()
        setLoading(false)
    }

    if (!topBarState.publish) return null

    return (
        <PublishButton $loading={loading} onClick={click}> PUBLISH </PublishButton>
    )
}