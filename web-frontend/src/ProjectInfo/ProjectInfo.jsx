import { Attributions } from "../Attributions/Attributions";
import CardSection from "../CardSection/CardSection";
import styles from "./ProjectInfo.module.css";

const ProjectInfo = () => {
    return (
        <>
            <CardSection>
                <h2 className={styles.title}>US State Health AI Legislation</h2>
                <h3 className={styles.subtitle}>
                    Insurance, Infrastructure, and Privacy Laws
                </h3>
            </CardSection>
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
            <CardSection title="Suggested Citation">
                <div className={styles.citationTitle}>
                    To cite the US State Health AI Legislation Map, please use
                    the following citation:
                </div>
                <div className={styles.citation}>
                    Ian Stevens, Alden Blatter, Erin Williams, Yael Bensoussan,
                    Bridge to AI Voice Consortium, Jean-Christophe
                    Bélisle-Pipon, Vardit Ravitsky. “US States Health AI
                    Legislation Dataset.” (2025). Hastings on the Hill.
                    Retrieved [Month Day, Year], from{" "}
                    <a href="med-ai-laws.thehastingcenter.org" target="_">
                        med-ai-laws.thehastingcenter.org
                    </a>
                    .
                </div>
            </CardSection>
            <CardSection title="Attributions" descriptions={[]}>
                <Attributions />
            </CardSection>
        </>
    );
};

export default ProjectInfo;
