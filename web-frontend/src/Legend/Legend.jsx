import _ from "lodash";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../Card/Card";
import { getNumLegislationsColor } from "../map/getStateColor";
import { useStates } from "../map/states";
import styles from "./Legend.module.css";

const FILL_OPACITY = 1;

const Legend = () => {
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );

    const states = useStates();
    const maxNumLegislations = useMemo(() => {
        if (!states) {
            return 0;
        }
        return _(states).map("legislations.length").maxBy();
    }, [states]);

    if (!isMapInitialized) {
        return null;
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.title}>Legend</h2>
            <div className={styles.legendContent}>
                <div className={styles.legendGradient} style={{}}>
                    <div
                        className={styles.legendGradientFill}
                        style={{
                            background: `linear-gradient(to top, white 5%, ${getNumLegislationsColor(1, maxNumLegislations)} 20%, ${getNumLegislationsColor(maxNumLegislations, maxNumLegislations)}) 95%`,
                            opacity: FILL_OPACITY,
                        }}
                    />
                </div>
                <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: FILL_OPACITY,
                                    backgroundColor: getNumLegislationsColor(
                                        maxNumLegislations,
                                        maxNumLegislations,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>
                            {maxNumLegislations} Datasets
                        </div>
                    </div>
                    {maxNumLegislations > 3 && (
                        <div className={styles.etc}></div>
                    )}
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: FILL_OPACITY,
                                    backgroundColor: getNumLegislationsColor(
                                        2,
                                        maxNumLegislations,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>2 Datasets</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: FILL_OPACITY,
                                    backgroundColor: getNumLegislationsColor(
                                        1,
                                        maxNumLegislations,
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>1 Dataset</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendItemColor}>
                            <div
                                className={styles.legendItemColorFill}
                                style={{
                                    opacity: FILL_OPACITY,
                                    backgroundColor: "#fff",
                                }}
                            />
                        </div>
                        <div className={styles.legendItemText}>0 Datasets</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Legend;
