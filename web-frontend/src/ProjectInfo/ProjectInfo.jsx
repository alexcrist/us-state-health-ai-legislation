import { Attributions } from "../Attributions/Attributions";
import CardSection from "../CardSection/CardSection";

const ProjectInfo = () => {
    return (
        <>
            {/* <div className={styles.header}>
                <div className={styles.headerTexts}>
                    <h1 className={styles.headerText}>
                        US State Health AI Legislation
                    </h1>
                    <h3 className={styles.subheaderText}>
                        Insurance, Infrastructure, and Privacy Laws
                    </h3>
                </div>
            </div> */}
            <CardSection
                title="About"
                descriptions={[
                    "The development and use of artificial intelligence in health care settings is growing rapidly in the United States. State legislatures are subsequently working to pass legislation regulating the novel ethical and legal situations that arise. This map tracks enacted US state legislation that relates, directly or indirectly, to the medical applications of artificial intelligence, including algorithms, machine learning, and predictive modeling. Overall, the states demonstrate and thus were categorized into four main groups: data privacy, insurance, infrastructure, and task force.",
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
