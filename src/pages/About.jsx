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
          className={styles.icon}
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
        <div className={styles.aboutHeader}></div>
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
              <h3>President of Outdoor Adventures</h3>
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
            <h2>About Me</h2>
            <p>
              I am a rising senior at Boston College, studying Computer Science
              (BS) and pursuing a minor in Management and Leadership. I'm
              passionate about using computer science to provide practical
              solutions to significant real-world challenges.
            </p>
            <p>
              I have extensive experience in Python, Pytorch, CVXPY, and general
              machine-learning concepts through my experience working on a
              machine-learning model designed to identify code vulnerabilities (
              <a href={"./#/projects"}>read more</a>). Additionally, I have
              experience in Java, SpringBoot APIs, HTML/CSS, React, and identity
              and access management (IAM) through my work with Boston College
              IT's Middleware group.
            </p>
            <p>
              Apart from CS, I also have a deep love for the outdoors and am
              actively serving as the president for the Outdoor Adventures Co-op
              at BC. My goal is to be able to use my technical skills to provide
              ways for outdoor lovers to build connections, discover new
              adventures, and plan safer trips.
            </p>
            <p>
              I am actively searching for software engineering opportunities. If
              you are interested in connecting please use one of the links below
              my profile to reach me.
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
              imgSrc={`${publicUrl}/assets/gallery/with_dad_hike.jpg`}
              description={"Hiking trip with dad."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/alex_jeff_evan.jpeg`}
              description={"Me and friends hiking Mt Washington."}
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/pres-traverse.jpeg`}
              description={
                "Presidential Traverse (view from Mt. Washington summit)."
              }
            />
            <GalleryTile
              imgSrc={`${publicUrl}/assets/gallery/washington-trail.jpeg`}
              description={"Mt. Washington via Ammonoosuc Ravine Trail."}
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
