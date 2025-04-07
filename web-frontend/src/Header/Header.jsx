import classNames from "classnames";
import styles from "./Header.module.css";

const Header = ({ isMobile }) => {
    return (
        <div
            className={classNames(styles.container, {
                [styles.isMobile]: isMobile,
            })}
        >
            <div className={styles.imageContainer}>
                <img
                    src="Hastings-Logo-RGB-Full-H.png"
                    className={styles.hastingsImage}
                    alt="The Hastings Center logo"
                />
            </div>
            <div className={styles.imageContainer}>
                <img src="wave.png" className={styles.waveImage} />
                <img
                    src="bridge2ai-logo.png"
                    className={styles.bridge2AiImage}
                    alt="Bridge2AI Voice"
                />
            </div>
        </div>
    );
};

export default Header;
