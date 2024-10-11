import { useEffect, useState } from "react"
import { AnimatePresence, motion } from 'framer-motion';
import { LogoSVG } from './HomeLogo';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

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

const MoreProjects = styled(motion.div)`
    padding: 0.5em 1em;
    border-radius: 5px;
    color: black;
    animation: pulse 4s infinite;
    fontSize: 14px; 
    fontStyle: italic; 
    fontWeight: 800; 
`;

export default function ExpandingLogo() {
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowMore(true)
        }, 15000)
    }, [])

    return (
        <LogoContainer to="/" $fancy={showMore ? 1 : 0} onMouseLeave={() => setShowMore(false)}>
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
    )
}

export function FloatingExpandingLogo() {
    return (
        <div style={{ position: 'fixed', top: '1.5em', left: '1.5em', zIndex: 1000 }}>
            <ExpandingLogo />
        </div>
    )
}