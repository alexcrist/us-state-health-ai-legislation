import classNames from "classnames";
import styles from "./Header.module.css";

const Header = ({ isMobile }) => {
    return (
        <div
            className={classNames(styles.container, {
                [styles.isMobile]: isMobile,
            })}
        >
            <div className={styles.headerTexts}>
                <h1 className={styles.headerText}>
                    US State Health AI Legislation
                </h1>
                <h3 className={styles.subheaderText}>
                    Insurance, Infrastructure, and Privacy Laws
                </h3>
            </div>
        </div>
    );
};

export default Header;
