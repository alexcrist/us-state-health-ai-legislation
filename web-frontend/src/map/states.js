import { useEffect, useState } from "react";
import { addGeoJsonLayer } from "./map";

const STATE_FILL_COLOR = "#fff";
const STATE_STROKE_COLOR = "#000";

const STATES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./geojson/cb_2018_us_state_5m.json"))
        .default;
    return geojson;
})();

export const useStates = () => {
    const [countries, setCountries] = useState(null);
    useEffect(() => {
        (async () => {
            const countries = await STATES_GEOJSON_PROMISE;
            setCountries(countries);
        })();
    }, []);
    return countries;
};

export const addStatesLayer = async (map) => {
    const geojson = await STATES_GEOJSON_PROMISE;
    addGeoJsonLayer(map, geojson, {
        fillColor: STATE_FILL_COLOR,
        fillOpacity: 1,
        strokeColor: STATE_STROKE_COLOR,
        strokeOpacity: 1,
        strokeWidth: 1,
    });
};
