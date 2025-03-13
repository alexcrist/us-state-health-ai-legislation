import { useEffect, useState } from "react";
import { WATER_FILL_COLOR } from "../constants";
import { addGeoJsonLayer } from "./map";

const LAKES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_50m_lakes.json")).default;
    return geojson;
})();

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

export const addLakesLayer = async (map) => {
    const lakes = await LAKES_GEOJSON_PROMISE;
    addGeoJsonLayer(map, lakes, {
        fillColor: WATER_FILL_COLOR,
        fillOpacity: 1,
        strokeOpacity: 0,
    });
};
