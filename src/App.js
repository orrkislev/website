import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainCards from "./components/MainCards";
import CodePage from "./components/CodePage";



export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CodePage />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
