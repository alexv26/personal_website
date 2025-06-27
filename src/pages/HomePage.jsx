import { useEffect, useRef, useState } from "react";
import styles from "./page_styles/HomePage.module.css";
import Block from "../components/Block";
const publicUrl = import.meta.env.BASE_URL;

function FadeInSection({ children }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // stop observing once visible
        }
      });
    });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, []);

  return (
    <div
      ref={domRef}
      className={`${styles.fadeIn} ${isVisible ? styles.visible : ""}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.overlay}>
            <div className={styles.heroContent}>
              <img
                src={`${publicUrl}/assets/alex.jpeg`}
                alt="Alex"
                className={styles.heroImage}
              />
              <div>
                <h1>Alexander Velsmid</h1>
                <p>
                  Aspiring Software Engineer Dedicated to Creating Helpful
                  Platforms and Exploring the Outdoors
                </p>
                <button
                  className={styles.cta}
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="about" className={styles.blocks}>
          <FadeInSection>
            <Block
              imgSrc={`${publicUrl}/assets/alex.jpeg`}
              header="My Info"
              subheading={
                "B.S. Computer Science, with a Minor in Management and Leadership at Boston College"
              }
              subsubheading={"Co-Captain of Outdoor Adventures"}
              text={[
                { bold: "Email", text: "velsmida@bc.edu", link: false },
                {
                  bold: "Github",
                  text: "https://github.com/alexv26",
                  linkTo: "https://github.com/alexv26",
                  link: true,
                },
                {
                  bold: "Linkedin",
                  text: "https://www.linkedin.com/in/alexander-velsmid/",
                  linkTo: "https://www.linkedin.com/in/alexander-velsmid/",
                  link: true,
                },
              ]}
            />
          </FadeInSection>
          <FadeInSection>
            <Block
              imgSrc={`${publicUrl}/assets/with_friends.JPG`}
              header="About Me"
              text={[
                {
                  text: "I am a rising senior at Boston College, studying Computer Science (BS) and pursuing a minor in Management and Leadership. Throughout my life I have been interested in problem-solving, and CS is the perfect way for me to turn this interest into a career. Not only is the process of coding in itself a problem-solving process, the applications we develop also provide solutions to pervasive real-world problems.",
                },
                {
                  text: "Read more...",
                  link: true,
                  linkTo: "./#/about",
                },
              ]}
            />
          </FadeInSection>
        </div>
      </div>
    </>
  );
}
