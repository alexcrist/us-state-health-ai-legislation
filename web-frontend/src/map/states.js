import { bbox } from "@turf/turf";
import _ from "lodash";
import { Marker } from "maplibre-gl";
import { useEffect, useState } from "react";
import { STATE_CODE_TO_LEGISLATIONS_MAP_PROMISE } from "./legislationData";
import { addGeoJsonLayer } from "./map";
import { sanitizeStateCode } from "./sanitizeStateCode";

const MARKER_CLASS_NAME = "state-marker";

export const LEGISLATIVE_CATEGORY_MAP = {
    "data privacy": "#209e78",
    insurance: "#d75f0a",
    infrastructure: "#766fb2",
    "task force": "#e92688",
};

const getStateLegislativeMetadata = (state) => {
    const metadata = {
        fillColor: "#fff",
        strokeColor: "#000",
        textOpacity: 1,
        strokeOpacity: 1,
    };
    if (state.legislations.length === 0) {
        metadata.fillColor = "#c2cef9";
        metadata.textOpacity = 0.5;
        metadata.strokeOpacity = 0.1;
    }
    metadata.legislativeCategories = _(state.legislations)
        .map((items) => _.find(items, { label: "Category" }))
        .map("data")
        .uniq()
        .sortBy()
        .value();
    metadata.legislativeCategoryColors = metadata.legislativeCategories.map(
        (category) => {
            let color = LEGISLATIVE_CATEGORY_MAP[category.toLowerCase()];
            if (!color) {
                console.warn(
                    `Unknown 'Category' in Google Sheet data: ${category}`,
                );
                color = "#ccc";
            }
            return color;
        },
    );
    return metadata;
};

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

    // Add legislative metdata to states
    states = states.map((state) => {
        const metadata = getStateLegislativeMetadata(state);
        return { ...state, ...metadata };
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

const getStatesGeoJson = async () => {
    const states = await STATES_PROMISE;
    return {
        type: "FeatureCollection",
        features: states.map((state) => {
            return {
                ...state.geojson,
                properties: state,
            };
        }),
    };
};

export const addStatesFillLayer = async (map) => {
    const statesGeoJson = await getStatesGeoJson();
    addGeoJsonLayer(map, statesGeoJson, {
        strokeOpacity: 0,
        fillOpacity: 1,
        extraFillPaintOptions: { "fill-color": ["get", "fillColor"] },
    });
};

export const addStatesStrokeLayer = async (map) => {
    const statesGeoJson = await getStatesGeoJson();
    addGeoJsonLayer(map, statesGeoJson, {
        fillOpacity: 0,
        strokeWidth: 1,
        extraStrokePaintOptions: {
            "line-color": ["get", "strokeColor"],
            "line-opacity": ["get", "strokeOpacity"],
        },
    });
};

export const addStatesLabelsLayer = async (map) => {
    let statesGeoJson = await getStatesGeoJson();
    for (const feature of statesGeoJson.features) {
        addStateLabel(map, feature.properties);
    }
};

const addStateLabel = (map, state) => {
    const element = document.createElement("div");
    const opacity = state.legislativeCategoryColors.length > 0 ? 1 : 0.3;
    const fontSize = state.legislativeCategoryColors.length > 0 ? 14 : 12;
    element.className = MARKER_CLASS_NAME;
    element.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; opacity: ${opacity};">
            <div style="font-size: ${fontSize}px; text-shadow: 0 0 3px white, 0 0 6px white; color: black;">
                ${state.code}
            </div>
            <div style="display: flex;">
                ${state.legislativeCategoryColors
                    .map((color) => {
                        return `
                            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 2px rgba(255, 255, 255, 0.8), 0 0 6px rgba(255, 255, 255, 0.4); margin: 0 1px">
                            </div>
                        `;
                    })
                    .join("")}
            </div>
        </div>
    `;
    new Marker({ element }).setLngLat(state.coordLonLat).addTo(map);
};
