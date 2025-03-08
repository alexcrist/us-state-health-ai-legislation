import { bbox } from "@turf/turf";
import { useEffect, useState } from "react";
import { addGeoJsonLayer } from "./map";

export const STATES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./usa-states.json")).default;
    return geojson;
})();

const STATES_PROMISE = (async () => {
    const geojson = await STATES_GEOJSON_PROMISE;
    return geojson.features.map((feature) => {
        const { properties } = feature;
        return {
            name: properties.name,
            code: properties.postal,
            geojson: feature,
            bbox: bbox(feature),
            coordLonLat: [properties.longitude, properties.latitude],
        };
    });
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

export const addStatesLayer = async (map) => {
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

export const addAlaskaHawaiiRectangles = (map) => {
    const left = -134.5;
    const top = 27.3;
    const middle = -116.75;
    const right = -107.8;
    const bottom = 17;
    const lineString = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [left, top],
                        [left, bottom],
                        [right, bottom],
                        [right, top],
                        [left, top],
                    ],
                },
                properties: {},
            },
            {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [middle, top],
                        [middle, bottom],
                    ],
                },
                properties: {},
            },
        ],
    };
    addGeoJsonLayer(map, lineString, {
        strokeWidth: 1,
        fillOpacity: 1,
        fillColor: "#99AEF3",
    });
};
