import { useMemo, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import styles from "./CollapsibleLegislation.module.css";

const CollapsibleLegislation = ({ legislation }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const details = useMemo(() => {
        return (
            <div className={styles.details}>
                {legislation.map(({ label, data }, index) => {
                    return (
                        <div
                            className={styles.legislation}
                            key={`row-${index}`}
                        >
                            <div className={styles.legislationKey}>
                                {label}:
                            </div>
                            <div className={styles.legislationValue}>
                                {data}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [legislation]);

    const title = useMemo(() => {
        const billTitle = legislation.find(
            ({ label }) => label === "Bill Title",
        ).data;
        return billTitle;
    }, [legislation]);

    if (!legislation) {
        return null;
    }

    return (
        <div
            className={`${styles.container} ${isExpanded ? styles.isExpanded : ""}`}
        >
            <div
                className={styles.header}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={styles.title}>{title}</div>
                <div className={`${styles.arrow}`}>
                    <FaChevronUp />
                </div>
            </div>
            {isExpanded ? details : null}
        </div>
    );
};

export default CollapsibleLegislation;
