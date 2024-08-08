import { useState } from 'react';
import { styled } from 'styled-components';

const PopUpContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 10px;
    padding: 1.5em 1em .5em 1em;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background-color: white;
    border: none;
    cursor: pointer;
    width: 2em;
    height: 2em;
    border-radius: 50%;
`;

export default function PopUp() {
    const [enabled, setEnabled] = useState(false);

    if (!enabled) return null;

    return (
        <PopUpContainer>
            <CloseButton onClick={() => setEnabled(false)}>X</CloseButton>
            hi
        </PopUpContainer>
    )
}