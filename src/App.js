import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ProjectPage, { VariationPage } from "./components/ProjectPage";
import UserContentPage from "./components/UserContentPage";
import './App.css';
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/Landing Page/Landing";
import ReactGA from 'react-ga4';

const TRACKING_ID = "G-4TBZDMD106"

export default function App() {

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:name" element={<ProjectPage />} />
        <Route path="/:name/u/:hash" element={<UserContentPage />} />
        <Route path="/:name/v/:variation" element={<VariationPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  );
}

function CatchAll() {
  const location = useLocation();

  console.log(location);

  return <h1>{location.pathname} not found</h1>;
}
