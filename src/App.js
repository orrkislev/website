import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import ProjectPage from "./components/ProjectPage";
import UserContentPage from "./components/UserContentPage";
import './App.css';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:name" element={<ProjectPage />} />
        <Route path="/:name/:hash" element={<UserContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
