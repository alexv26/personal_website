import React, { useState, useEffect, useRef } from "react";
import styles from "./Pong.module.css";

const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const AI_DEBUFF = 0.6;

export default function Pong() {
  const [playerY, setPlayerY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2); // relative to top of player
  const [aiY, setAiY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(WIDTH / 2 - BALL_SIZE / 2); // ball position (X axis)
  const [ballY, setBallY] = useState(HEIGHT / 2 - BALL_SIZE / 2); // ball position (Y axis): relative to top of ball
  const [ballDX, setBallDX] = useState(BALL_SPEED); // ball velocity (X axis)
  const [ballDY, setBallDY] = useState(BALL_SPEED); // ball velocity (Y axis)
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const gameAreaRef = useRef(null);
  const keysPressed = useRef({});

  // Handle player paddle movement with keyboard
  useEffect(() => {
    function handleKeyDown(e) {
      // Prevent arrow keys from scrolling the page
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        keysPressed.current[e.key] = true;
      }
    }
    function handleKeyUp(e) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        keysPressed.current[e.key] = false;
      }
    }
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Move player paddle
      if (keysPressed.current["ArrowUp"]) {
        setPlayerY((y) => Math.max(0, y - PADDLE_SPEED));
      }
      if (keysPressed.current["ArrowDown"]) {
        setPlayerY((y) => Math.min(HEIGHT - PADDLE_HEIGHT, y + PADDLE_SPEED));
      }

      // Move AI paddle: simple follow ball with some delay (60% player speed)
      setAiY((aiY) => {
        const centerAi = aiY + PADDLE_HEIGHT / 2;
        if (centerAi < ballY) {
          return Math.min(
            aiY + PADDLE_SPEED * AI_DEBUFF,
            HEIGHT - PADDLE_HEIGHT
          );
        } else if (centerAi > ballY) {
          return Math.max(aiY - PADDLE_SPEED * AI_DEBUFF, 0);
        }
        return aiY;
      });

      // ball movement
      setBallX((x) => x + ballDX);
      setBallY((y) => y + ballDY);

      // collision with top or bottom
      if (ballY + ballDY <= 0 || ballY + ballDY + BALL_SIZE >= HEIGHT) {
        setBallDY((dy) => -dy);
      }

      // collision with player paddle
      if (
        ballX + ballDX <= PADDLE_WIDTH && // go into paddle
        ballY + BALL_SIZE >= playerY && // ball y pos is not below paddle
        ballY <= playerY + PADDLE_HEIGHT // below top of paddle
      ) {
        setBallDX(Math.abs(ballDX)); // bounce right
      }

      // collision with AI paddle
      if (
        ballX + ballDX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
      ) {
        setBallDX(-Math.abs(ballDX)); // bounce left
      }

      // Score check
      if (ballX + ballDX < 0) {
        // AI scores
        setAiScore((score) => score + 1);
        resetBall();
      } else if (ballX + ballDX + BALL_SIZE > WIDTH) {
        // Player scores
        setPlayerScore((score) => score + 1);
        resetBall();
      }
    }, 16); // ~60fps

    function resetBall() {
      setBallX(WIDTH / 2 - BALL_SIZE / 2);
      setBallY(HEIGHT / 2 - BALL_SIZE / 2);
      // Randomize initial direction
      setBallDX(Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED);
      setBallDY(Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED);
    }

    return () => clearInterval(interval);
  }, [ballDX, ballDY, ballX, ballY, playerY, aiY]);

  return (
    <>
      <div
        ref={gameAreaRef}
        className={styles.gameArea}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Player paddle */}
        <div
          className={styles.playerPaddle}
          style={{
            top: `${(playerY / HEIGHT) * 100}%`,
            width: `${(PADDLE_WIDTH / WIDTH) * 100}%`,
            height: `${(PADDLE_HEIGHT / HEIGHT) * 100}%`,
          }}
        ></div>

        {/* AI paddle */}
        <div
          className={styles.AiPaddle}
          style={{
            top: `${(aiY / HEIGHT) * 100}%`,
            width: `${(PADDLE_WIDTH / WIDTH) * 100}%`,
            height: `${(PADDLE_HEIGHT / HEIGHT) * 100}%`,
          }}
        ></div>

        {/* Ball */}
        <div
          className={styles.ball}
          style={{
            left: `${(ballX / WIDTH) * 100}%`,
            top: `${(ballY / HEIGHT) * 100}%`,
            width: `${(BALL_SIZE / WIDTH) * 100}%`,
            height: `${(BALL_SIZE / HEIGHT) * 100}%`,
          }}
        ></div>

        {/* Scores */}
        <div
          className={styles.scores}
          style={{
            left: 20,
          }}
        >
          Player: {playerScore}
        </div>
        <div
          className={styles.scores}
          style={{
            right: 20,
          }}
        >
          AI: {aiScore}
        </div>

        <div className={styles.directions}>
          Use ↑ and ↓ arrow keys to move paddle
        </div>
      </div>
      <div className={styles.mobileControls}>
        <button
          onTouchStart={() => (keysPressed.current["ArrowUp"] = true)}
          onTouchEnd={() => (keysPressed.current["ArrowUp"] = false)}
        >
          ⬆️
        </button>
        <button
          onTouchStart={() => (keysPressed.current["ArrowDown"] = true)}
          onTouchEnd={() => (keysPressed.current["ArrowDown"] = false)}
        >
          ⬇️
        </button>
      </div>
    </>
  );
}
