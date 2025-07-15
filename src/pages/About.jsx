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

function Icon({ iconSrc, linkTo }) {
  return (
    <>
      <a href={linkTo} target="_blank" rel="noopener noreferrer">
        <img
          style={{ maxWidth: "40px" }}
          src={`${publicUrl}/assets/icons/${iconSrc}`}
        />
      </a>
    </>
  );
}

export default function About() {
  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.aboutHeader}>
          <h2>About Me</h2>
        </div>
        <div className={styles.aboutSection}>
          <div className={styles.aboutImgAndLinks}>
            <img
              className={styles.aboutImg}
              src={`${publicUrl}/assets/alex.jpeg`}
            />
            <div className={styles.aboutMeText}>
              <h1>Alex Velsmid</h1>
              <h2>
                B.S. Computer Science, with a Minor in Management and Leadership
                at Boston College
              </h2>
              <h3>Co-Captain of Outdoor Adventures</h3>
            </div>

            <div className={styles.links}>
              <Icon
                iconSrc="github-mark-white.svg"
                linkTo="https://github.com/alexv26"
              />
              <Icon iconSrc="email.png" linkTo="mailto:velsmida@bc.edu" />
              <Icon
                iconSrc="linkedin.png"
                linkTo="https://www.linkedin.com/in/alexander-velsmid/"
              />
              <Icon iconSrc="resume.png" linkTo="./#/pdfviewer/resume.pdf" />
            </div>
          </div>
          <div className={styles.box}>
            <p>
              I am a rising senior at Boston College, studying Computer Science
              (BS) and pursuing a minor in Management and Leadership. Throughout
              my life I have been interested in problem-solving, and computer
              science is the perfect way for me to channel this passion into a
              career. Beyond the problem-solving inherent in coding itself, the
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
        </div>
        <div className={styles.galleryWrapper}>
          <div className={styles.galleryHeader}>
            <h2>Gallery</h2>
          </div>
          <div className={styles.gallery}>
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/washington.jpeg`}
              description={"Approaching Mt. Washington summit."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/pres-traverse.jpeg`}
              description={
                "Presidential Traverse (View from Mt. Washington summit)."
              }
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/washington-trail.jpeg`}
              description={"Mt. Washington via Ammonoosuc Ravine Trail."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/alex_jeff_evan.jpeg`}
              description={"Me and friends hiking Mt Washington."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/moosilauke.jpeg`}
              description={"Mt. Moosilauke summit."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/lexi.JPG`}
              description={"My dog Lexi 🕊️🤍."}
            />

            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/universal.jpeg`}
              description={
                "High school senior trip to Universal Studios with friends."
              }
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/monroe.jpeg`}
              description={"Mt. Monroe Summit."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/with_dad_hike.jpg`}
              description={"Hiking trip with dad."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/volley.jpeg`}
              description={"Intramural Volleyball Team."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/bike.jpeg`}
              description={"My bike on the Charles River Esplanade."}
            />
          </div>
        </div>
      </div>
    </>
  );
}
