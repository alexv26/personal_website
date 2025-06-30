import styles from "./page_styles/Game.module.css";

export default function Game() {
  return (
    <>
      <div className={styles.flexWrapper}>
        <div className={styles.box}>
          <h2>You found the secret!</h2>
          <p>
            After the nuke explosion you will be rewarded with an interactive
            game, which is a WIP. Come back later to see the final product
          </p>
        </div>
      </div>
    </>
  );
}
