import styled from "styled-components";

const ProjectDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: ${props => props.flip ? 'row-reverse' : 'row'};
`;
const ProjectImgContainer = styled.div`
    flex: 1;
`;

const ProjectImg = styled.img`
    width: 100%;
    object-fit: cover;
`;

const ProjectBody = styled.div`
    flex: 1;
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: .5em;
`;

export default function Project(props){
    return (
        <ProjectDiv flip={props.flip}>
            <ProjectImgContainer>
                <ProjectImg src={'./'+props.img} />
            </ProjectImgContainer>
            <ProjectBody>
                {props.children}
            </ProjectBody>
        </ProjectDiv>
    );
}