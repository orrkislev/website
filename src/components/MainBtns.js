import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { topBarAtom } from './Tabs';
import useProject from '../utils/useProject';

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-around;
  align-items: center;
`;

const StyledButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  color: ${props => props.$isActive ? 'black' : '#555'};
`;

const SVGContainer = styled.div`
  position: absolute;
  top: -5px;
  left: -10px;
  width: 100%;
  height: 110%;
  pointer-events: none;
`;

export default function MainBtns() {
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)
    const project = useProject()

    useEffect(() => {
        return () => setTopBarState({ main: 'parameters', info: false })
    }, [])

    const [activeButton, setActiveButton] = useState('PLAY');
    const buttonRefs = [useRef(), useRef(), useRef()]
    const mainRef = useRef();

    const buttons = [
        { name: 'PLAY', value: 'parameters' },
        { name: 'WORK', value: 'code' },
        { name: 'EXPLORE', value: 'variations' }
    ]
    const buttonVariants = {
        active: { scale: 1.1, transition: { duration: 0.3 } },
        inactive: { scale: 1, transition: { duration: 0.3 } }
    };

    let svg = null;

    if (buttonRefs[0].current && buttonRefs[1].current && buttonRefs[2].current) {
        const offsetX = mainRef.current.getBoundingClientRect().x;
        const btn_play = buttonRefs[0].current.getBoundingClientRect()
        const btn_work = buttonRefs[1].current.getBoundingClientRect()
        const btn_expl = buttonRefs[2].current.getBoundingClientRect()
        btn_play.x = btn_play.x - offsetX + 10;
        btn_work.x = btn_work.x - offsetX + 10
        btn_expl.x = btn_expl.x - offsetX + 10


        const shapeVariants = {
            play: { x: btn_play.x, width: btn_play.width, y: 0 },
            work: { x: btn_work.x, width: btn_work.width, y: 0 },
            explore: { x: btn_expl.x, width: btn_expl.width, y: 0 }
        };

        const rectVariants = {
            play: { x: btn_play.x - 1, y: 5, rotate: 30 },
            work: { x: btn_work.x + btn_work.width - 7.5, y: 25, rotate: -90 },
            explore: { x: btn_expl.x - 7.5, y: 7.5, rotate: 180 }
        }
        const circleVariants = {
            play: { cx: btn_play.x + 2, cy: 22.5 + 9 },
            work: { cx: btn_work.x + btn_work.width, cy: 22.5 - 6 },
            explore: { cx: btn_expl.x + btn_expl.width - 2, cy: 22.5 - 8 }
        }
        const malbenVariants = {
            play: { x: btn_play.x + btn_play.width - 10, y: 10, rotate: 20 },
            work: { x: btn_work.x - 10, y: 15, rotate: 0 },
            explore: { x: btn_expl.x + btn_expl.width, y: 12, rotate: 220 }
        }
        const triangleVariants = {
            play: { x: btn_play.x + btn_play.width - 20, y: 5, rotate: 30 },
            work: { x: btn_work.x - 10, y: 0, rotate: -180 },
            explore: { x: btn_expl.x - 7, y: 23, rotate: 180 }
        }


        svg = (
            <SVGContainer>
                <svg width="600px" height="45px" viewBox="0 0 600 45">
                    <motion.rect
                        x="0" y={(45 - 30) / 2} width="180" height="30" rx="15" ry="15"
                        initial={{ x: shapeVariants.play.x, width: shapeVariants.play.width }}
                        fill="none" stroke="black" strokeWidth="2"
                        animate={activeButton.toLowerCase()}
                        variants={shapeVariants}
                    />

                    <motion.rect
                        x="0" y="0"
                        initial={{ x: rectVariants.play.x, y: rectVariants.play.y, rotate: rectVariants.play.rotate }}
                        width="15" height="15" rx="2" ry="2"
                        fill="tomato" stroke="black" strokeWidth="2"
                        transition={{ duration: 0.5, type: 'spring', delay: 0.5 }}
                        animate={activeButton.toLowerCase()}
                        variants={rectVariants} />

                    <motion.circle
                        cx="0" cy="0" r="7.5"
                        initial={{ cx: circleVariants.play.cx, cy: circleVariants.play.cy }}
                        fill="cornflowerblue" stroke="black" strokeWidth="2"
                        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.7 }}
                        animate={activeButton.toLowerCase()}
                        variants={circleVariants} />

                    <motion.rect
                        x="0" y="0" width="15" height="30" rx="2" ry="2"
                        initial={{ x: malbenVariants.play.x, y: malbenVariants.play.y, rotate: malbenVariants.play.rotate }}
                        fill="orange" stroke="black" strokeWidth="2"
                        transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.6 }}
                        animate={activeButton.toLowerCase()}
                        variants={malbenVariants} />

                    <motion.g
                        x="0" y="0"
                        transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.0 }}
                        initial={{ x: triangleVariants.play.x, y: triangleVariants.play.y, rotate: triangleVariants.play.rotate }}
                        animate={activeButton.toLowerCase()}
                        variants={triangleVariants}>
                        <polygon points="0,0 15,0 7.5,12.99" fill="seagreen" stroke="black" strokeWidth="2" />
                    </motion.g>
                </svg>
            </SVGContainer>
        )
    }

    return (
        <div ref={mainRef} style={{ position: 'relative', margin: '3px 0' }}>
            <ButtonContainer>
                {buttons.map((button, index) => (
                    <StyledButton
                        key={button.name}
                        ref={buttonRefs[index]}
                        $isActive={activeButton === button.name}
                        onClick={() => {
                            setActiveButton(button.name)
                            setTopBarState({ ...topBarState, main: button.value })
                            project.rerun()
                        }}
                        variants={buttonVariants}
                        animate={activeButton === button ? 'active' : 'inactive'}
                    >
                        {button.name}
                    </StyledButton>
                ))}
            </ButtonContainer>
            {svg}
        </div>
    );
};
