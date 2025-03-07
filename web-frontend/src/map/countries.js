import { useEffect, useState } from "react";

const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_10m_admin_0_countries.json")).default;
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
