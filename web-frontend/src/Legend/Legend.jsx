import { useSelector } from "react-redux";
import Card from "../Card/Card";
import styles from "./Legend.module.css";

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
            <div className={styles.legendContent}>[Add content here]</div>
        </Card>
    );
};

export default Legend;
