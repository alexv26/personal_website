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
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <ScrollToTop />
        <div
          className="background-image"
          style={{
            "--bg-url": `url('${
              import.meta.env.BASE_URL
            }assets/background.jpeg')`,
          }}
        ></div>
        <NavigationBar />
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/*" element={<Error errorCode={404} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
