import React, { useState, useEffect, useRef } from 'react';
import Demo, { HeroBackground } from './Demo';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/useUser';
import tw from 'tailwind-styled-components';

export default function HeroSection() {
    return (
        <section className="flex justify-center items-center relative h-[65vh]">
            <div className="absolute inset-0">
                <HeroBackground />
            </div>
            <div className="relative z-10">
                <HeroLeftSide />
            </div>
        </section >
    )
}


const MainButton = tw.button`bg-black px-4 py-2 mr-4 text-white rounded-full hover:bg-orange-300 transition-colors hover:text-bold hover:scale-110 transition-all duration-300`
const SecondaryButton = tw.button`px-4 py-2 text-black rounded-full border-2 border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300`


function HeroLeftSide() {
    const navigate = useNavigate()

    const goPro = () => { }

    return (
        <>
            <HeroTitle />
            <div className="text-center mt-4">
                <MainButton onClick={()=>navigate('/thingies')}>Try the Demo</MainButton>
                <SecondaryButton onClick={goPro}>Go Pro</SecondaryButton>
            </div>
        </>
    )
}







const wordSets = [
    ['Creative', 'Inventive', 'Playful', 'Wacky', 'Algorithmic', 'Digital', 'Interactive', 'Generative'],
    ['coding', 'art', 'exploration', 'experiments', 'tinkering', 'hacking', 'doodling'],
    ['sparks', 'nurtures', 'ignites', 'unleashes', 'revolutionizes', 'baffles', 'mesmerizes'],
    ['imagination', 'innovation', 'curiosity', 'serendipity', 'chaos', 'wonder', 'giggles', 'breakthroughs']
];

function HeroTitle() {
    const [currentIndices, setCurrentIndices] = useState(wordSets.map(() => 0));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndices(prevIndices => {
                const newIndices = [...prevIndices];
                const setToChange = Math.floor(Math.random() * wordSets.length);
                newIndices[setToChange] = (newIndices[setToChange] + 1) % wordSets[setToChange].length;
                return newIndices;
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const words = wordSets.map((set, index) => <HeroWord key={index} word={set[currentIndices[index]]} />)
    words.splice(2, 0, <br key="br" />);

    return (
        <h1 className="text-6xl font-bold mb-4 font-light text-nowrap text-center font-serif">
            {words}
        </h1>
    );
};

function HeroWord({ word }) {
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        setIsNew(true);
        const timer = setTimeout(() => setIsNew(false), 500);
        return () => clearTimeout(timer);
    }, [word]);

    return (
        <span className={`transition-colors ${isNew ? 'duration-100' : 'duration-1000'} ${isNew ? 'text-blue-500' : 'text-black'}`}>
            {word.toUpperCase()}{' '}
        </span>
    );
}