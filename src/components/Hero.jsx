import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import styles from "./component_styles/Hero.module.css";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";

// colors to cycle through
const COLORS = [
  "#13FFAA", // Aqua Green
  "#1E67C6", // Deep Space Blue
  "#DD335C", // Cosmic Red
  "#00C2D1", // Nebula Aqua
  "#00FFB2", // Electric Mint
  "#0077FF", // Stellar Blue
  "#FF4F4F", // Rocket Red
  "#00E5FF", // Galactic Cyan
  "#2EFFA3", // Alien Green
];

export default function Hero() {
  const navigate = useNavigate();
  const publicUrl = import.meta.env.BASE_URL; // Moved here as it's used in this component

  const color = useMotionValue(COLORS[0]);
  const backgroundImage = useMotionTemplate`
  radial-gradient(125% 100% at 50% 0%, #020617 50%, ${color})
    `;

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 30,
      repeat: Infinity,
      repeatType: "mirror",
    });
  });

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className={styles["aurora-hero-section"]}
    >
      <div className={styles.heroContent}>
        <img
          src={`${publicUrl}/assets/alex.jpeg`}
          alt="Alex"
          className={styles.heroImage}
        />
        <div className={styles.headerText}>
          <h1>Alexander Velsmid</h1>
          <p>
            Aspiring Software Engineer Dedicated to Designing Impactful Software
            and Exploring the Outdoors
          </p>
          <motion.button
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            style={{ border, boxShadow }}
            onClick={() => navigate("./about")}
            className={styles.animButton}
          >
            Learn More <FiArrowRight className={styles.animArrow} />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
