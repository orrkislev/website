import React, { useState, useEffect, useRef } from 'react';
import Demo from './Demo';
import usePatreon, { getPatreonLogInUrl } from '../../utils/usePatreon';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const sectionRef = useRef(null);
    return (
        <section className="flex justify-between items-start p-20 bg-gray-200 relative" ref={sectionRef}>
            <div className="w-1/2">
                <HeroLeftSide sectionRef={sectionRef} />
            </div>
            <div className="absolute top-0 h-full right-8 w-3/5 bg-white rounded-lg translate-y-1/4 aspect-w-16 aspect-h-9 overflow-hidden">
                <Demo />
            </div>
        </section>
    )
}


function BigCircle({ active, parentRef }) {
    const [size, setSize] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (parentRef.current) {
            const { width, height } = parentRef.current.getBoundingClientRect();
            setDimensions({ width, height });
            const maxSize = Math.sqrt(width * width + height * height) * 2 + 200;
            setSize(active ? maxSize : 0);
        }
    }, [active, parentRef]);

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
                <clipPath id="section-clip">
                    <rect width={dimensions.width} height={dimensions.height} />
                </clipPath>
            </defs>
            <circle
                cx={-100}
                cy={dimensions.height / 2}
                r={size / 2}
                fill="#f6ad55"
                clipPath="url(#section-clip)"
                className="transition-all duration-700 ease-in-out"
            />
        </svg>
    );
}


function HeroLeftSide({ sectionRef }) {
    const navigate = useNavigate()
    const patreon = usePatreon()
    const state = patreon.gotAccess ? 'fullAccess' : patreon.username ? 'noAccess' : 'notLoggedIn'
    const [showBig, setShowBig] = useState(false)

    const logIn = () => {
        window.location.href = getPatreonLogInUrl()
    }
    const openPatreon = () => {
        window.open('https://www.patreon.com/orrkislev', '_blank')
    }
    const startExploring = () => {
        navigate(`/thingies`)
    }
    const keepExploring = () => {
        navigate(`/thingies`)
    }

    let buttons = [
        <button className="bg-white px-4 py-2 rounded mr-4 hover:bg-orange-300 transition-colors hover:text-bold hover:scale-110 transition-all duration-300"
            onMouseEnter={() => setShowBig(true)} onMouseLeave={() => setShowBig(false)}
            onClick={()=>startExploring()}
        >
            Start Here
        </button>,
        <button className="bg-transparent border-gray-500 px-4 py-2 rounded hover:bg-gray-400 hover:text-bold hover:scale-110 transition-all duration-300"
            onClick={logIn}>login with Patreon</button>
    ]

    if (state == 'fullAccess') {
        buttons = [
            <div>HI {patreon.username}, thanks for your support!</div>,
            <button className="bg-white px-4 py-2 rounded mr-4 hover:bg-gray-200" onClick={()=>keepExploring()}>Keep Exploring</button>,
        ]
    } else if (state == 'noAccess') {
        buttons = [
            <div>HI {patreon.username}</div>,
            <button className="bg-white px-4 py-2 rounded mr-4" onClick={openPatreon}>Become a Patron</button>,
            <button className="bg-transparent border-gray-500 px-4 py-2 rounded hover:bg-gray-400 hover:text-bold hover:scale-110 transition-all duration-300"
                    onClick={()=>keepExploring()}>Keep Exploring</button>
        ]
    }

    return (
        <>
            <BigCircle active={showBig} parentRef={sectionRef} />
            <HeroTitle />
            {buttons}
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
        }, 2000); // Change a word every 2 seconds

        return () => clearInterval(intervalId);
    }, []);

    const words = wordSets.map((set, index) => <HeroWord key={index} word={set[currentIndices[index]]} />)
    words.splice(2, 0, <br key="br" />);

    return (
        <h1 className="text-4xl font-bold mb-4 font-light">
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