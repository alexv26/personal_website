import styles from "./page_styles/About.module.css";

function GalleryTile({ imgSrc, description }) {
  return (
    <div className={styles.galleryTile}>
      <img src={imgSrc} />
      <p>{description}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.aboutSection}>
          <div className={styles.box}>
            <h1>About Me</h1>
            <p>
              I am a rising senior at Boston College, studying Computer Science
              (BS) and pursuing a minor in Management and Leadership. Throughout
              my life I have been interested in problem-solving, and CS is the
              perfect way for me to turn this interest into a career. Not only
              is the process of coding in itself a problem-solving process, the
              applications we develop also provide solutions to pervasive
              real-world problems.
            </p>
            <p>
              In addition to my passion and skill in computer science, I also
              have a passion for the outdoors. When I was young, my dad
              introduced me to the Cub Scouts, where I gained my first real
              outdoor experiences. I then continued through the Boy Scouts and
              achieved the award of Eagle Scout, the highest award in the
              program. In college I wanted to continue that experience, so I
              joined Boston College's Outdoor Adventures program as a trip
              leader, and lead trips across New England for the community to
              enjoy. This coming year, I am serving as the club's Co-Captain,
              and hope to be able to create a welcoming and accessible
              environment for all.
            </p>
            <p>
              To further my committment to leadership and serving my community,
              I began pursuing a minor in Management and Leadership. Throughout
              my early career, between my jobs at Tatte bakery, the BC
              Intramural program, and the IT department at BC, I have observed
              the incredible value an effective manager brings to a team
              environment. This minor will help me build more effective teams
              both from a production standpoint, but also from a teamwork and
              relationship angle.
            </p>
          </div>
          <div className={styles.imageBox}>
            <img src={"src/assets/with_friends.JPG"} alt="With friends" />
          </div>
        </div>
        <div className={styles.galleryWrapper}>
          <div className={styles.galleryHeader}>
            <h2>Gallery</h2>
          </div>
          <div className={styles.gallery}>
            <GalleryTile
              imgSrc={"src/assets/gallery/alex_jeff_evan.jpeg"}
              description={"Me, Jeffrey, and Evan hiking Mt Washington"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/washington.jpeg"}
              description={"Approaching Mt. Washington summit"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/moosilauke.jpeg"}
              description={"At the Mt. Moosilauke summit"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/freshman_friends.jpg"}
              description={"Freshman year friends"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/hiking_with_bsa.jpeg"}
              description={"Hiking with Boy Scout troop up Mt. Lafayette"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/universal.jpeg"}
              description={"High school senior trip to Universal Studios"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/monroe.jpeg"}
              description={"Mt. Monroe Summit"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/refereeing.jpg"}
              description={"Refereeing club basketball"}
            />
            <GalleryTile
              imgSrc={"src/assets/gallery/orientation.jpeg"}
              description={"Freshman year orientation"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
