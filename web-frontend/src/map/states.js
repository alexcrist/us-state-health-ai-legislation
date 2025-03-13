import { bbox } from "@turf/turf";
import _ from "lodash";
import { useEffect, useState } from "react";
import { getStateColor } from "./getStateColor";
import { STATE_CODE_TO_LEGISLATIONS_MAP_PROMISE } from "./legislationData";
import { addGeoJsonLayer } from "./map";
import { sanitizeStateCode } from "./sanitizeStateCode";

export const STATES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./usa-states.json")).default;
    return geojson;
})();

const STATES_PROMISE = (async () => {
    // Parse state data from geojson
    const geojson = await STATES_GEOJSON_PROMISE;
    let states = geojson.features.map((feature) => {
        const { properties } = feature;
        return {
            name: properties.name,
            code: sanitizeStateCode(properties.postal),
            geojson: feature,
            bbox: bbox(feature),
            coordLonLat: [properties.longitude, properties.latitude],
        };
    });

    // Validate legislation data
    const stateCodeToLegislationsMap =
        await STATE_CODE_TO_LEGISLATIONS_MAP_PROMISE;
    const validStateCodeSet = new Set(_.map(states, "code"));
    Object.keys(stateCodeToLegislationsMap).forEach((stateCode) => {
        if (!validStateCodeSet.has(stateCode)) {
            console.warn(
                `Unknown state code found in legislation data Google Sheet: ${stateCode}. This row will be ignored`,
            );
        }
    });

    // Add legislation data to states
    states = states.map((state) => {
        const legislations = stateCodeToLegislationsMap[state.code] ?? [];
        return { ...state, legislations };
    });

    // Add color to states
    states = states.map((state) => {
        const color = getStateColor(states, state);
        return { ...state, color };
    });

    return states;
})();

export const getStates = async () => {
    const states = await STATES_PROMISE;
    return states;
};

export const useStates = () => {
    const [countries, setCountries] = useState(null);
    useEffect(() => {
        (async () => {
            const countries = await STATES_PROMISE;
            setCountries(countries);
        })();
    }, []);
    return countries;
};

export const addStatesFillLayer = async (map) => {
    const states = await STATES_PROMISE;
    const statesGeoJson = {
        type: "FeatureCollection",
        features: states.map((state) => {
            return {
                ...state.geojson,
                properties: { color: state.color },
            };
        }),
    };
    addGeoJsonLayer(map, statesGeoJson, {
        strokeOpacity: 0,
        fillOpacity: 1,
        extraPaintOptions: { "fill-color": ["get", "color"] },
    });
};

export const addStatesStrokeLayer = async (map) => {
    const geojson = await STATES_GEOJSON_PROMISE;
    addGeoJsonLayer(map, geojson, {
        fillOpacity: 0,
        strokeColor: "#000",
        strokeOpacity: 1,
        strokeWidth: 1,
    });
};

const TEXT_SCALE = 1.5;
const ZOOM_TO_TEXT_SIZES = [
    [1, 1 * TEXT_SCALE],
    [10, 40 * TEXT_SCALE],
    [20, 400 * TEXT_SCALE],
].reduce((flatList, [zoom, textSize]) => {
    return [...flatList, Number(zoom), Number(textSize)];
}, []);

export const addStatesLabelsLayer = async (map) => {
    const states = await STATES_PROMISE;
    map.addLayer({
        id: "state-labels",
        type: "symbol",
        source: {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: states.map((state) => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: state.coordLonLat,
                        },
                        properties: { name: state.code },
                    };
                }),
            },
        },
        layout: {
            "text-field": ["get", "name"],
            "text-size": [
                "interpolate",
                ["exponential", 1.1],
                ["zoom"],
                ...ZOOM_TO_TEXT_SIZES,
            ],
            "text-font": ["NotoSansRegular"],
            "symbol-placement": "point",
            "text-allow-overlap": true,
        },
        paint: {
            "text-color": "#000000",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 2,
            "text-halo-blur": 1,
            "text-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1,
                0, // Transparent at zoom 1.5
                2,
                1, // Opaque isible at zoom 3
            ],
        },
    });
};
