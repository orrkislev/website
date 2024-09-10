import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import ProjectPage, { VariationPage } from "./components/ProjectPage";
import UserContentPage from "./components/UserContentPage";
import './App.css';
import LoginPage from "./components/LoginPage";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:name" element={<ProjectPage />} />
        <Route path="/:name/u/:hash" element={<UserContentPage />} />
        <Route path="/:name/v/:variation" element={<VariationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
