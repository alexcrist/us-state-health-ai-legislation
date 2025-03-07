import { useCallback } from "react";
import { useFlyToBbox, useFlyToPoint } from "./map";

// Fly to a state
export const useFlyToState = () => {
    const flyToBbox = useFlyToBbox();
    const flyToPoint = useFlyToPoint();
    return useCallback(
        (state) => {
            if (state.name === "Alaska") {
                const [lon, lat] = state.coordLonLat;
                flyToPoint(lon, lat, 2.7);
            } else if (state.name === "Hawaii") {
                const [lon, lat] = state.coordLonLat;
                flyToPoint(lon, lat, 4);
            } else {
                flyToBbox(state.bbox);
            }
        },
        [flyToBbox, flyToPoint],
    );
};
