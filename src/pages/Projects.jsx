import styles from "./page_styles/Projects.module.css";
const publicUrl = import.meta.env.BASE_URL;
console.log(publicUrl);

function ProjectTile({ title, description, imgSrc, linkTo }) {
  return (
    <div className={styles.projectTile}>
      <h2>{title}</h2>
      <img src={imgSrc} />
      <p>{description}</p>
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
          />
        </div>
      </div>
    </>
  );
}
