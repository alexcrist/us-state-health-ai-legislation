import classNames from "classnames";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../../constants";
import StarsBackground from "../../StarsBackground/StarsBackground";
import { useFlyToBbox, useInitMap } from "../map";
import styles from "./Map.module.css";

let hasFlown = false;

const Map = () => {
    // Initialize the map
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    useInitMap();

    // Fly to target on load
    const flyToBbox = useFlyToBbox();
    useEffect(() => {
        if (isMapInitialized && !hasFlown) {
            hasFlown = true;
            flyToBbox([-125.0011, 24.9493, -66.9326, 49.5904], {
                duration: 4000,
            });
        }
    }, [flyToBbox, isMapInitialized]);

    return (
        <div
            className={classNames(styles.container, {
                [styles.isMapInitialized]: isMapInitialized,
            })}
        >
            <StarsBackground />
            <div className={styles.loading}>Loading...</div>
            <div className={styles.map} id={MAP_CONTAINER_ID} />
        </div>
    );
};

export default Map;
