import { useSelector } from "react-redux";
import Card from "../Card/Card";
import ProjectInfo from "../ProjectInfo/ProjectInfo";
import StateInfo from "../StateInfo/StateInfo";
import styles from "./InfoCard.module.css";

const InfoCard = () => {
    const focusedState = useSelector((state) => state.main.focusedState);
    let content;
    if (focusedState) {
        content = <StateInfo />;
    } else {
        content = <ProjectInfo />;
    }
    return (
        <Card className={styles.container}>
            <div className={styles.content}>{content}</div>
        </Card>
    );
};

export default InfoCard;
