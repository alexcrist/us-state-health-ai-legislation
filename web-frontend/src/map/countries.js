import { useEffect, useState } from "react";
import { WATER_FILL_COLOR } from "../constants";
import { addGeoJsonLayer } from "./map";

const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_10m_admin_0_countries.json")).default;
    return geojson;
})();

const LAKES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_10m_lakes.json")).default;
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
    const lakes = await LAKES_GEOJSON_PROMISE;
    const usa = countries.features.filter(
        (feature) => feature.properties.NAME === "United States of America",
    )[0];
    addGeoJsonLayer(map, countries, {
        fillColor: "#fff",
        fillOpacity: 0.4,
        strokeOpacity: 0,
    });
    addGeoJsonLayer(map, usa, {
        fillColor: "#fff",
        fillOpacity: 1,
        strokeOpacity: 0,
    });
    addGeoJsonLayer(map, lakes, {
        fillColor: WATER_FILL_COLOR,
        fillOpacity: 1,
        strokeOpacity: 0,
    });
};
