import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { WATER_FILL_COLOR } from "../constants";
import { addGeoJsonLayer } from "./map";
import { getStates } from "./states";

const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_50m_admin_0_countries.json")).default;
    return geojson;
})();

const LAKES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_50m_lakes.json")).default;
    return geojson;
})();

export const useCountriesGeojson = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            const data = await COUNTRIES_GEOJSON_PROMISE;
            setData(data);
        })();
    }, []);
    return data;
};

export const useLakesGeojson = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            const data = await LAKES_GEOJSON_PROMISE;
            setData(data);
        })();
    }, []);
    return data;
};

export const addCountriesLayer = async (map) => {
    const countries = await COUNTRIES_GEOJSON_PROMISE;
    countries.features = countries.features.filter((feature) => {
        return feature.properties.NAME !== "United States of America";
    });
    const lakes = await LAKES_GEOJSON_PROMISE;
    addGeoJsonLayer(map, countries, {
        fillColor: "#fff",
        fillOpacity: 0.4,
        strokeOpacity: 0,
    });
    const getStateColor = () => {
        // TODO
        const LOW_NUM_DATASETS_COLOR = "#ffffff";
        const HIGH_NUM_DATASETS_COLOR = "#0F9A0F";
        const COLOR_SCALE = chroma.scale([
            LOW_NUM_DATASETS_COLOR,
            HIGH_NUM_DATASETS_COLOR,
        ]);
        return COLOR_SCALE(Math.random()).hex();
    };
    const states = {
        type: "FeatureCollection",
        features: (await getStates()).map((state) => {
            return {
                ...state.geojson,
                properties: { color: getStateColor(state) },
            };
        }),
    };
    addGeoJsonLayer(map, states, {
        strokeOpacity: 0,
        fillOpacity: 1,
        extraPaintOptions: { "fill-color": ["get", "color"] },
    });
    addGeoJsonLayer(map, lakes, {
        fillColor: WATER_FILL_COLOR,
        fillOpacity: 1,
        strokeOpacity: 0,
    });
};
