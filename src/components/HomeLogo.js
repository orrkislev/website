import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HomeLogoDiv = styled(Link)`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
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

export default function HomeLogo() {
    return (
        <HomeLogoDiv to="/">
            <LogoSVG width="30px" height="30px" />
        </HomeLogoDiv>
    )
}

export function FullLogo() {
    return (
        <LogoContainer to="/" >
            <LogoSVG width="30px" height="30px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: 800, lineHeight: '8px' }}>Stuff I Made For You</div>
                <div style={{ fontSize: '11px' }}>by Orr Kislev</div>
            </div>
        </LogoContainer>
    )
}

export function LogoSVG({ width, height }) {
    const [rotation, setRotation] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const interval = setTimeout(() => {
            setRotation(Math.random() * 720 - 360);
        }, Math.random() * 10000 + 5000);
        return () => clearTimeout(interval);
    }, [rotation])

    return (
        <motion.svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-10 -10 100 100"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            stroke="black" strokeWidth={8}
            width={width} height={height}
            initial={{ rotate: 0, fill: "black" }}
            animate={{ rotate: rotation, fill: hover ? "white" : "black" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            <path d="M40.09,39.98c-1.24,4.59-1.87,8.12-3.16,11.39-2.33,5.9-4.32,12.15-7.83,17.32-3.66,5.39-8.71,9.93-13.63,14.3-2.23,1.98-5.6,2.73-8.5,3.9-3.42,1.38-5.4-.45-5.52-3.56C.83,66.92.48,50.51,0,34.09c-.09-2.95,1.51-4.07,4.14-4.56,7.96-1.48,15.9-3.05,24.29-4.67-.95-7.68-1.93-15.49-3.02-24.28C34.31.32,42.72-.04,51.13,0c.98,0,2.57,2.13,2.81,3.46,1.38,7.54-1.91,13.1-8.04,17.04,10.11,9.71,20.16,19.3,27.44,31.17,5.44,8.86,9.99,18.27,14.91,27.45,1.87,3.47.21,4.98-3.15,5.24-8.44.65-16.88,1.26-25.33,1.77-3.27.2-5.38-.8-6.44-4.62-3.44-12.27-7.41-24.39-11.2-36.56-.42-1.33-1.05-2.59-2.04-4.98Z" />
        </motion.svg>
    )
}