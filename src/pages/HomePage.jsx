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
          observer.unobserve(entry.target);
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

function Countdown({ onComplete }) {
  const countdownTime = 10000;
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const timerRef = useRef();

  useEffect(() => {
    const start = performance.now();
    timerRef.current = requestAnimationFrame(function update(now) {
      const elapsed = now - start;
      const remaining = Math.max(countdownTime - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining > 0) {
        timerRef.current = requestAnimationFrame(update);
      } else {
        onComplete();
      }
    });
    return () => cancelAnimationFrame(timerRef.current);
  }, [onComplete]);

  const seconds = Math.floor(timeLeft / 1000);
  const milliseconds = Math.floor(timeLeft % 1000)
    .toString()
    .padStart(3, "0");

  return (
    <div className={styles.countdown}>
      <h1 className={styles.countdownHeader}>
        ☢️ Nuke Launch In: {seconds}.{milliseconds} seconds ☠️
      </h1>
    </div>
  );
}

export default function HomePage() {
  const [secretButtonIsVisible, setSecretButtonIsVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [nukeActive, setNukeActive] = useState(false);
  const [showNukeVideo, setShowNukeVideo] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [launchCodeInput, setLaunchCodeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const initialAudioRef = useRef();
  const nukeAudioRef = useRef();
  const glitchAudioRef = useRef();
  const nukeVideoRef = useRef();

  // Hardcoded launch code
  const LAUNCH_CODE = "the silly caterpillar";

  useEffect(() => {
    if (clickCount === 3) {
      setSecretButtonIsVisible(true);
    }
  }, [clickCount]);

  useEffect(() => {
    if (nukeActive) {
      // Play initial audio
      initialAudioRef.current?.play();

      // After 4 seconds, show countdown
      const timer = setTimeout(() => {
        setShowCountdown(true);
      }, 3000);

      // Cleanup timeout if unmounted or nukeActive changes
      return () => clearTimeout(timer);
    } else {
      // Reset countdown display if nuke is not active
      setShowCountdown(false);
    }
  }, [nukeActive]);

  function onNukeVideoEnded() {
    if (initialAudioRef.current) {
      initialAudioRef.current.pause();
      initialAudioRef.current.currentTime = 0;
    }
    setShowNukeVideo(false);
    nukeAudioRef.current?.pause();
    nukeAudioRef.current.currentTime = 0;
    document.body.style.overflow = "auto";
    window.location.href = "./#/game";
  }

  function handleCountdownComplete() {
    // Lock scroll and show video
    document.body.style.overflow = "hidden";
    setShowNukeVideo(true);

    // Play the nuke explosion audio
    setTimeout(() => {
      nukeAudioRef.current
        ?.play()
        .catch((e) => console.warn("Nuke audio error:", e));
    }, 100); // slight delay to sync with video
  }

  function handleLaunchCodeSubmit(e) {
    e.preventDefault();
    if (launchCodeInput.toLowerCase() === LAUNCH_CODE) {
      setNukeActive(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect launch code!");
    }
    setLaunchCodeInput("");
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.overlay}>
            <div className={styles.heroContent}>
              <button
                onClick={() => setClickCount(clickCount + 1)}
                className={styles.profileButton}
                style={{ background: "none" }}
              >
                <img
                  src={`${publicUrl}/assets/alex.jpeg`}
                  alt="Alex"
                  className={styles.heroImage}
                />
              </button>
              <div>
                <h1>Alexander Velsmid</h1>
                <p>
                  Aspiring Software Engineer Dedicated to Creating Helpful
                  Platforms and Exploring the Outdoors
                </p>
                <button
                  className={styles.cta}
                  onClick={() => {
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="about" className={styles.blocks}>
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

          <Block
            imgSrc={`${publicUrl}/assets/with_friends.JPG`}
            header="About Me"
            text={[
              {
                text: "I am a rising senior at Boston College, studying Computer Science (BS) and pursuing a minor in Management and Leadership. Throughout my life I have been interested in problem-solving, and CS is the perfect way for me to turn this interest into a career.",
              },
              {
                text: "Read more...",
                link: true,
                linkTo: "./#/about",
              },
            ]}
          />
        </div>

        {secretButtonIsVisible && !nukeActive && (
          <div className={styles.secretButton}>
            <form onSubmit={handleLaunchCodeSubmit}>
              <input
                type="text"
                value={launchCodeInput}
                onChange={(e) => setLaunchCodeInput(e.target.value)}
                placeholder="Enter Launch Code"
                className={styles.launchCodeInput}
                autoFocus
              />
              <button type="submit" className={styles.launchCodeButton}>
                Launch
              </button>
              {errorMessage && (
                <div className={styles.errorText}>{errorMessage}</div>
              )}
            </form>
          </div>
        )}

        {nukeActive && (
          <>
            {/* Audio Tracks */}
            <audio ref={initialAudioRef} src={`${publicUrl}/assets/nuke.mp3`} />
            <audio
              ref={nukeAudioRef}
              src={`${publicUrl}/assets/nuke_and_glitch.mp3`}
            />

            {/* Countdown */}
            {!showNukeVideo && showCountdown && (
              <Countdown onComplete={handleCountdownComplete} />
            )}

            {/* Nuke Explosion Video (muted) */}
            {showNukeVideo && (
              <video
                ref={nukeVideoRef}
                src={`${publicUrl}/assets/nuke_and_glitch.mp4`}
                autoPlay
                muted
                playsInline
                className={styles.fullscreenVideo}
                controls={false}
                onEnded={onNukeVideoEnded}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
