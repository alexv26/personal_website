import styles from "./page_styles/Game.module.css";

export default function Game() {
  return (
    <>
      <div className={styles.flexWrapper}>
        <div className={styles.box}>
          <h2 style={{ color: "red", textEmphasis: "bold", fontSize: "40px" }}>
            YOU DIED
          </h2>
          <p>
            Congrats. You found the secret. But, you blew up the whole website.
            nice going.
          </p>
        </div>
      </div>
    </>
  );
}
