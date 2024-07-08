import styled from "styled-components";
import Card from "./Card";
import { projects } from "../utils/data";
import { createElement } from "react";

const Main = styled.div`
  margin: 0 auto;
  max-width: 66em;
  padding: 1em;
  margin-top: 1em;
  display: flex;
  gap: 1em;
`;

const MainItem = styled.div`
  border-radius: 0.25em;
  overflow: hidden;
`

const Major = styled(MainItem)`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: .5em;
`;

const Minor = styled(MainItem)`
  background: #f5f5f5;
  flex: 2;
  position: sticky;
`;

export default function MainCards(props) {
    return (
        <Main>
            <Major>
                {projects.map((project, projectIndex) => {
                    const Project = project.component;
                    return createElement(Project, { key: project.name, flip: projectIndex % 2 == 0 });
                })}
            </Major>

            <Minor>
                <Card />
            </Minor>
        </Main>
    );
}