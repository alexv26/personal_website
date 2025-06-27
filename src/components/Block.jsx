import styles from "./component_styles/Block.module.css";

export default function Block({
  imgSrc,
  header,
  subheading,
  subsubheading,
  text,
}) {
  return (
    <div className={styles.flexContainer}>
      <img src={imgSrc} />
      <div className={styles.textContainer}>
        <h2 className={styles.header}>{header}</h2>
        {subheading && <h3 className={styles.subheader}>{subheading}</h3>}
        {subsubheading && (
          <h3 className={styles.subsubheader}>{subsubheading}</h3>
        )}
        <div className={styles.bodyText}>
          {Array.isArray(text) &&
            text
              .filter((entry) => entry.text !== "Read more...")
              .map((entry, index) => (
                <div key={index}>
                  <p className={styles.text}>
                    {entry.bold && <b>{entry.bold}:</b>}
                  </p>
                  {!entry.link && <p>{entry.text}</p>}
                  {entry.link && <a href={entry.linkTo}>{entry.text}</a>}
                </div>
              ))}
          {Array.isArray(text) &&
            text.some((entry) => entry.text === "Read more...") && (
              <div className={styles.readMoreWrapper}>
                <a
                  href={text.find((e) => e.text === "Read more...").linkTo}
                  className={styles.readMore}
                >
                  Read more...
                </a>
              </div>
            )}
          {!Array.isArray(text) && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    </div>
  );
}
