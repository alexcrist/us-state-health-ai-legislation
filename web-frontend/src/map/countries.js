import { useEffect, useState } from "react";
import { addGeoJsonLayer } from "./map";

const COUNTRY_FILL_COLOR = "#ddd";
const COUNTRY_STROKE_COLOR = "#333";

const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./geojson/ne_10m_admin_0_countries.json"))
        .default;
    geojson.features = geojson.features.filter((feature) => {
        return feature.properties.NAME_EN !== "United States of America";
    });
    return geojson;
})();

export const useCountries = () => {
    const [countries, setCountries] = useState(null);
    useEffect(() => {
        (async () => {
            const countries = await COUNTRIES_GEOJSON_PROMISE;
            setCountries(countries);
        })();
    }, []);
    return countries;
};

export const addCountriesLayer = async (map) => {
    const geojson = await COUNTRIES_GEOJSON_PROMISE;
    addGeoJsonLayer(map, geojson, {
        fillColor: COUNTRY_FILL_COLOR,
        fillOpacity: 1,
        strokeColor: COUNTRY_STROKE_COLOR,
        strokeOpacity: 1,
        strokeWidth: 1,
    });
};
