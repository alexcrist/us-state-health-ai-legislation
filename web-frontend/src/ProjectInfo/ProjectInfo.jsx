import { Attributions } from "../Attributions/Attributions";
import CardSection from "../CardSection/CardSection";
import styles from "./ProjectInfo.module.css";

const ProjectInfo = () => {
    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerTexts}>
                    <h1 className={styles.headerText}>
                        Global Voice Datasets Repository Map
                    </h1>
                    <h3 className={styles.subheaderText}>
                        Accessibility, Licensing, and Research Ethics
                    </h3>
                </div>
            </div>
            <CardSection
                title="About"
                descriptions={[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                ]}
            />
            <CardSection
                title="Contact"
                descriptions={[
                    <>
                        You can contact us with questions or comments by
                        emailing{" "}
                        <a
                            href="mailto:alden_blatter@sfu.ca"
                            target="_"
                            rel="noreferrer"
                        >
                            alden_blatter@sfu.ca
                        </a>
                    </>,
                ]}
            />
            <CardSection title="Attributions" descriptions={[]}>
                <Attributions />
            </CardSection>
        </>
    );
};

export default ProjectInfo;
