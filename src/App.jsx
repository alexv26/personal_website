// App.jsx
import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Error from "./pages/Error";
import Projects from "./pages/Projects";
import Game from "./pages/Game";
import Game2 from "./game/page/Game2";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ✅ Now we can use useLocation safely here
function AppContent() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      {location.pathname !== "/game" && (
        <div
          className="background-image"
          style={{
            "--bg-url": `url('${
              import.meta.env.BASE_URL
            }assets/background.jpeg')`,
          }}
        ></div>
      )}
      {location.pathname === "/game" && <div className="backgroundColor"></div>}
      <NavigationBar />
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/game" element={<Game2 />} />
          <Route path="/game2" element={<Game />} />
          <Route path="/*" element={<Error errorCode={404} />} />
        </Routes>
      </div>
    </>
  );
}

// ✅ Wrap the entire app in <Router> at the top level
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
