import classNames from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAP_CONTAINER_ID, USA_BBOX } from "../../constants";
import mainSlice from "../../mainSlice";
import StarsBackground from "../../StarsBackground/StarsBackground";
import { getStateAtPoint } from "../getStateAtPoint";
import { useAddMapClickListener, useFlyToBbox, useInitMap } from "../map";
import { useFlyToState } from "../useFlyToState";
import { useShowHoveredState } from "../useShowHoveredState";
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
            flyToBbox(USA_BBOX, { duration: 2000 });
        }
    }, [flyToBbox, isMapInitialized]);

    // Allow state selection
    const addMapClickListener = useAddMapClickListener();
    const flyToState = useFlyToState();
    const dispatch = useDispatch();
    useEffect(() => {
        return addMapClickListener(async (event) => {
            const lon = event.lngLat.lng;
            const lat = event.lngLat.lat;
            const state = await getStateAtPoint(lon, lat);
            if (state) {
                dispatch(mainSlice.actions.setFocusedState(state));
                flyToState(state);
            }
        });
    }, [addMapClickListener, dispatch, flyToState]);

    // On map hover, show info pop-up
    const hoveredState = useShowHoveredState();

    return (
        <div
            className={classNames(styles.container, {
                [styles.isMapInitialized]: isMapInitialized,
            })}
        >
            <StarsBackground />
            <div className={styles.loading}>Loading...</div>
            <div className={styles.map} id={MAP_CONTAINER_ID} />
            {hoveredState}
        </div>
    );
};

export default Map;
