// App.jsx
import { useState, useEffect, useRef } from "react";
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
import Game2 from "./fallout_game/page/Game2";
import PDFViewer from "./pages/PDFViewer";
import Pong from "./pong_game/page/Pong";
import "./App.css";

const backgroundImg = false; // This flag still controls your other backgrounds

function AppContent() {
  const location = useLocation();
  const publicUrl = import.meta.env.BASE_URL; // publicUrl needs to be available here

  return (
    <>
      {/* Background Layer: Mutually exclusive rendering */}
      {location.pathname === "/" ? (
        // IF ON HOMEPAGE, RENDER ONLY VANTA BACKGROUND
        <div
          className="backgroundGradient"
          style={{
            position: "fixed", // Ensure fixed positioning
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
      ) : (
        // IF NOT ON HOMEPAGE, RENDER OTHER BACKGROUNDS BASED ON EXISTING LOGIC
        <>
          {backgroundImg && location.pathname !== "/game" && (
            <div
              className="background-image"
              style={{
                position: "fixed", // Ensure fixed positioning
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                "--bg-url": `url('${publicUrl}assets/background.jpeg')`,
              }}
            ></div>
          )}
          {location.pathname === "/game" && (
            <div
              className="backgroundColor"
              style={{
                position: "fixed", // Ensure fixed positioning
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
              }}
            ></div>
          )}
          {!backgroundImg && location.pathname !== "/game" && (
            <div
              className="backgroundGradient"
              style={{
                position: "fixed", // Ensure fixed positioning
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
              }}
            />
          )}
        </>
      )}

      {/* Foreground Content */}
      <NavigationBar />
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/game" element={<Game2 />} />
          <Route path="/game2" element={<Game />} />
          <Route path="/pong" element={<Pong />} />
          <Route path="/pdfviewer/:pdfName" element={<PDFViewer />} />
          <Route path="/*" element={<Error errorCode={404} />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      {/* ScrollToTop must be within Router to use useLocation */}
      <AppContent />
    </Router>
  );
}
