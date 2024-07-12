import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Code from "./components/Code";



export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/:name" element={<Code />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
