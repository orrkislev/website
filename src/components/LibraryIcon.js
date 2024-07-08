import styled from "styled-components"

const LibraryIconA = styled.a`
    margin:  0 10px;
`;

const libs = {
    'p5':{
        website: 'https://p5js.org/',
        name: 'p5.js',
        icon: 'https://p5js.org/assets/img/p5js.svg'
    },
    'matter':{
        website: 'https://brm.io/matter-js/',
        name: 'Matter.js',
        icon: 'https://brm.io/matter-js/img/matter-js.svg'
    },
    'paper':{
        website: 'http://paperjs.org/',
        name: 'Paper.js',
        icon: 'http://paperjs.org/images/paperjs.svg'
    }
}

export default function LibraryIcon({ name }) {
    return (
        <LibraryIconA href={libs[name].website} target="_blank">
            <img src={libs[name].icon} alt={libs[name].name} height="17"/>
        </LibraryIconA>
    )
}