import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from "./component_styles/NavigationBar.module.css";

function NavigationBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["center-content"]}>
          {" "}
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/Projects">Projects</Link>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
