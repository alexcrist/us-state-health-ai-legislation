import { useEffect, useState } from "react";
import { getIsMobileDevice } from "../getIsMobileDevice";
import { getStateAtPoint } from "../map/getStateAtPoint";
import {
    useAddMapEventListener,
    useGetLonLatFromPoint,
    useRenderGeoJson,
} from "../map/map";
import styles from "./HoveredState.module.css";

const HoveredState = ({ x, y }) => {
    // Is the map zooming / panning (disable hover detection during these animations)
    const [isMapMoving, setIsMapMoving] = useState(false);
    const [isMapZooming, setIsMapZooming] = useState(false);

    // Actively hovered state
    const [hoveredState, setHoveredState] = useState(null);

    // Determine hovered state
    const getLonLatFromPoint = useGetLonLatFromPoint();
    useEffect(() => {
        (async () => {
            if (isMapMoving || isMapZooming) {
                setHoveredState(null);
                return;
            }
            const coordLonLat = getLonLatFromPoint(x, y);
            const lon = coordLonLat[0];
            const lat = coordLonLat[1];
            const hoveredState = await getStateAtPoint(lon, lat);
            setHoveredState(hoveredState);
        })();
    }, [getLonLatFromPoint, isMapMoving, isMapZooming, x, y]);

    // Disable hover-detection while map is panning / zooming
    const addMapEventListener = useAddMapEventListener();
    useEffect(
        () => addMapEventListener("movestart", () => setIsMapMoving(true)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("moveend", () => setIsMapMoving(false)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("zoomstart", () => setIsMapZooming(true)),
        [addMapEventListener],
    );
    useEffect(
        () => addMapEventListener("zoomend", () => setIsMapZooming(false)),
        [addMapEventListener],
    );

    // Pop-up content for hovered state
    const [content, setContent] = useState(null);
    useEffect(() => {
        (async () => {
            // State is being hovered
            if (hoveredState) {
                const numDatasets = 0; // TODO
                setContent({
                    title: `${hoveredState.name}`,
                    descriptions: [
                        `Number of Datasets: ${numDatasets}`,
                        `State Name: ${hoveredState.name}`,
                    ],
                });
            }

            // Nothing is being hovered
            else {
                setContent(null);
            }
        })();
    }, [hoveredState]);

    // Highlight hovered state
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (hoveredState) {
            return renderGeoJson(hoveredState.geojson, {});
        }
    }, [hoveredState, renderGeoJson]);

    // Hide on mobile
    if (getIsMobileDevice()) {
        return null;
    }

    if (content === null) {
        return null;
    }
    return (
        <div className={styles.container} style={{ top: y, left: x }}>
            <div className={styles.triangle} />
            <div className={styles.content}>
                <h3 className={styles.title}>{content.title}</h3>
                {content.descriptions.map((description, index) => {
                    return (
                        <p key={index} className={styles.description}>
                            {description}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default HoveredState;
