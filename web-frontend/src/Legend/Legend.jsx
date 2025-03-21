import { useSelector } from "react-redux";
import Card from "../Card/Card";
import { LEGISLATIVE_CATEGORY_MAP } from "../map/states";
import { toTitleCase } from "../toTitleCase";
import styles from "./Legend.module.css";

const FILL_OPACITY = 1;

const Legend = () => {
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    if (!isMapInitialized) {
        return null;
    }
    return (
        <Card className={styles.card}>
            <h2 className={styles.title}>Legend</h2>
            <div className={styles.legendContent}>
                <div className={styles.legendItems}>
                    {Object.entries(LEGISLATIVE_CATEGORY_MAP).map(
                        ([category, color]) => {
                            return (
                                <div
                                    className={styles.legendItem}
                                    key={category}
                                >
                                    <div className={styles.legendItemColor}>
                                        <div
                                            className={
                                                styles.legendItemColorFill
                                            }
                                            style={{
                                                opacity: FILL_OPACITY,
                                                backgroundColor: color,
                                            }}
                                        />
                                    </div>
                                    <div className={styles.legendItemText}>
                                        {toTitleCase(category)}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Legend;
