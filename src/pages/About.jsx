import styles from "./page_styles/About.module.css";
const publicUrl = import.meta.env.BASE_URL;

function GalleryTile({ imgSrc, description }) {
  return (
    <div className={styles.galleryTile}>
      <img src={imgSrc} alt={description} />
      <p>{description}</p>
    </div>
  );
}

export default function About() {
  console.log(publicUrl);
  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.aboutSection}>
          <div className={styles.box}>
            <h1>About Me</h1>
            <p>
              I am a rising senior at Boston College, studying Computer Science
              (BS) and pursuing a minor in Management and Leadership. Throughout
              my life I have been interested in problem-solving, and computer
              science is the perfect way for me to channel this passion into a
              career. NBeyond the problem-solving inherent in coding itself, the
              applications we create provide practical solutions to significant
              real-world challenges.
            </p>
            <p>
              Alongside my passion for computer science, I also have a deep love
              for the outdoors. When I was young, my dad introduced me to the
              Cub Scouts, where I gained my first meaningful outdoor
              experiences. I continued through the Boy Scouts program,
              ultimately earning the Eagle Scout award—the highest honor in
              scouting. In college I wanted to continue that experience, so I
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
              environment. This program equips me to build stronger teams, not
              only by enhancing productivity but also by nurturing collaboration
              and positive relationships.
            </p>
          </div>
          <div className={styles.imageBox}>
            <img
              src={`${publicUrl}/assets/with_friends.JPG`}
              alt="With friends"
            />
          </div>
        </div>
        <div className={styles.galleryWrapper}>
          <div className={styles.galleryHeader}>
            <h2>Gallery</h2>
          </div>
          <div className={styles.gallery}>
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/alex_jeff_evan.jpeg`}
              description={"Me, Jeffrey, and Evan hiking Mt Washington"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/washington.jpeg`}
              description={"Approaching Mt. Washington summit"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/moosilauke.jpeg`}
              description={"At the Mt. Moosilauke summit"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/freshman_friends.jpg`}
              description={"Freshman year friends"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/hiking_with_bsa.jpeg`}
              description={"Hiking with Boy Scout troop up Mt. Lafayette"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/universal.jpeg`}
              description={"High school senior trip to Universal Studios"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/monroe.jpeg`}
              description={"Mt. Monroe Summit"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/refereeing.JPG`}
              description={"Refereeing club basketball"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/with_dad_hike.jpg`}
              description={"Hiking trip with my dad"}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/me_and_gavin.jpg`}
              description={"Me and my friend Gavin at graduation"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
