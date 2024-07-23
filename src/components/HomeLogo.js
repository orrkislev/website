import styled from 'styled-components'
import { Link } from 'react-router-dom';

const HomeLogoDiv = styled(Link)`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

export default function HomeLogo() {
    return (
        <HomeLogoDiv to="/">
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>HOME</div>
        </HomeLogoDiv>
    )
}