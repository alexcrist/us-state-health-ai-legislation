import classNames from "classnames";
import styles from "./Header.module.css";

const Header = ({ isMobile }) => {
    return (
        <div
            className={classNames(styles.container, {
                [styles.isMobile]: isMobile,
            })}
        >
            [Insert logo here]
        </div>
    );
};

export default Header;
