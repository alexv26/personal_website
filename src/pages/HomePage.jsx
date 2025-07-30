import styles from "./page_styles/HomePage.module.css";
import Block from "../components/Block"; // Assuming this is still used elsewhere or will be removed if not.
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";

export default function HomePage() {
  const navigate = useNavigate();
  const publicUrl = import.meta.env.BASE_URL; // Moved here as it's used in this component

  return (
    <>
      <div className={styles.hero}>
        <Hero />
      </div>
    </>
  );
}
