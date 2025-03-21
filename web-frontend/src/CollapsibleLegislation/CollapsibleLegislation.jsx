import chroma from "chroma-js";
import _ from "lodash";
import { useMemo, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { LEGISLATIVE_CATEGORY_MAP } from "../map/states";
import styles from "./CollapsibleLegislation.module.css";

const CollapsibleLegislation = ({ legislation }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { headerColor, rowColor } = useMemo(() => {
        const category = (
            _.find(legislation, {
                label: "Category",
            }).data ?? ""
        ).toLowerCase();
        const color = LEGISLATIVE_CATEGORY_MAP[category] ?? "#ccc";
        const darkColor = chroma.mix(color, "white", 0.1).hex();
        const mediumColor = chroma.mix(color, "white", 0.4).hex();
        const lightColor = chroma.mix(color, "white", 0.8).hex();
        const headerColor = isExpanded ? darkColor : mediumColor;
        const rowColor = lightColor;
        return {
            headerColor,
            rowColor,
        };
    }, [isExpanded, legislation]);

    const details = useMemo(() => {
        return (
            <div
                className={styles.details}
                style={{ borderColor: headerColor }}
            >
                {legislation.map(({ label, data }, index) => {
                    const color = index % 2 === 0 ? "transparent" : rowColor;
                    return (
                        <div
                            className={styles.legislation}
                            key={`row-${index}`}
                            style={{
                                backgroundColor: color,
                            }}
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
    }, [headerColor, legislation, rowColor]);

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
                style={{ backgroundColor: headerColor }}
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
