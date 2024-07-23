import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import ProjectPage from "./components/ProjectPage";



export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/:name" element={<ProjectPage />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
