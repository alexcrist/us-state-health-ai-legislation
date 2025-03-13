import { useEffect, useState } from "react";
import { addGeoJsonLayer } from "./map";

const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_50m_admin_0_countries.json")).default;
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

export const addCountriesLayer = async (map) => {
    const countries = await COUNTRIES_GEOJSON_PROMISE;
    countries.features = countries.features.filter((feature) => {
        return feature.properties.NAME !== "United States of America";
    });
    addGeoJsonLayer(map, countries, {
        fillColor: "#fff",
        fillOpacity: 0.4,
        strokeOpacity: 0,
    });
};
