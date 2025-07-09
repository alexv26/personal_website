import styles from "./page_styles/Projects.module.css";
const publicUrl = import.meta.env.BASE_URL;

function ProjectTile({ title, description, imgSrc, linkText, linkTo }) {
  return (
    <div className={styles.projectTile}>
      <h2>{title}</h2>
      <img src={imgSrc} />
      <p>{description}</p>
      {!!linkText && !!linkTo && (
        <a style={{ color: "turquoise", fontWeight: "bold" }} href={linkTo}>
          {linkText}
        </a>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <>
      <div className={styles.flexwrapper}>
        <div className={styles.content}>
          <h1>My Projects</h1>
          <ProjectTile
            title={
              "VulnML: Using Machine Learning to Detect Code Vulnerabilities"
            }
            description={
              "A big problem for every software engineer and tech company is ensuring their applications are secure. Without proper security, vulnerabilities in code can allow for hackers to gain unauthorized access to user data and private source code. Exploits in code can negatively affect consumers and products, which is a detrimental to companies. In the past, thousands of lines of code would have to be manually reviewed by professionals to find and remove these vulnerabilities. The goal of this project is to create and compare multiple machine learning algorithms that automate the process by taking in a function written in C and running a binary classification model on the function to label it as vulnerable or non-vulnerable. This would alleviate the pain of manual review, and help programmers create more secure applications."
            }
            imgSrc={`${publicUrl}/assets/vulnml.png`}
            linkText="Read more..."
            linkTo={
              "https://www.dropbox.com/scl/fi/kexa4ehuy04yr1z89lk2z/VulnML.pdf?rlkey=6lhr5w6en2f6hpnk31lbphkv7&e=1&st=m6k9tthb&dl=0"
            }
          />
          <ProjectTile
            title={"Nuke Fallout Game (WIP)"}
            description={
              "A simple, enjoyable decision-based game simulating a post-fallout world. I created this game while learning how to code in react, exploring how to use React hooks (like useState, useRef, and useEffect), and how to make interactable webpages. I additionally have always enjoyed video games, and creating this static game gave me the opportunity to weave my own sense of humor in a fun project. I plan to continue developing and working on this project, and also hope to be able to use the skills I learned to develop larger games."
            }
            imgSrc={`${publicUrl}/assets/fallout_game.png`}
            linkText="Play game"
            linkTo={"./#/game"}
          />
          <ProjectTile
            title={"TrailPlanner (WIP)"}
            description={
              "A website designed for lovers of the outdoors (particularly hikers and campers) to plan their outdoor adventures. A common issue in the hiking world is a lack of thorough planning for trips. People will frequently go on day trips without giving much thought to important safety considerations like finding the nearest hospital, alternate rouutes, etc. A contributing factor to this problem is that people have a hard time finding access to the right resoures, or putting together a solid meal plan. This website aims to solve that problem by guiding the user through the planning process, and automating monotonous steps. The user also has the option to browse past trips published by other users, saving them the trouble of creating a whole new plan from scratch. This project is still a work in progress."
            }
            imgSrc={`${publicUrl}/assets/trailplanner.png`}
          />
        </div>
      </div>
    </>
  );
}
