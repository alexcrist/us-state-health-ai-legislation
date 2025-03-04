import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useRenderGeoJson } from "./map";
import {
    FOCUSED_ENTITY_FILL_COLOR,
    FOCUSED_ENTITY_FILL_OPACITY,
} from "./mapVisuals";

export const useRenderStates = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    return useCallback(() => {
        if (!focusedCountry?.statesData) {
            return () => null;
        }
        const geojson = {
            type: "FeatureCollection",
            features: focusedCountry.statesData.map((stateData) => {
                return {
                    ...stateData.geojson,
                    properties: {
                        color: "#ffffff",
                    },
                };
            }),
        };
        return renderGeoJson(geojson, {
            fillColor: ["get", "color"],
            fillOpacity: 0,
            strokeOpacity: 0.5,
        });
    }, [focusedCountry, renderGeoJson]);
};

export const useRenderFocusedState = () => {
    const renderGeoJson = useRenderGeoJson();
    const focusedState = useSelector((state) => state.main.focusedState);
    return useCallback(() => {
        if (!focusedState) {
            return () => null;
        }
        return renderGeoJson(focusedState.geojson, {
            fillColor: FOCUSED_ENTITY_FILL_COLOR,
            fillOpacity: FOCUSED_ENTITY_FILL_OPACITY,
        });
    }, [focusedState, renderGeoJson]);
};
