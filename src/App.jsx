import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Error from "./pages/Error";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div className="background-image" />
        <NavigationBar />
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<Error errorCode={404} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
