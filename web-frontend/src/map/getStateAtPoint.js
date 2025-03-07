import { booleanPointInPolygon } from "@turf/turf";
import { getStates } from "./states";

export const getStateAtPoint = async (lon, lat) => {
    const states = await getStates();
    lon = fixLon(lon);
    for (let i = 0; i < states.length; i++) {
        const stateData = states[i];
        if (isPointInState(lon, lat, stateData.bbox, stateData.geojson)) {
            return stateData;
        }
    }
    return null;
};

// Add or subtract 360 until longitude is in [-180, 180]
const fixLon = (lon) => {
    while (lon > 180) {
        lon -= 360;
    }
    while (lon < -180) {
        lon += 360;
    }
    return lon;
};

const isPointInState = (lon, lat, bbox, geojson) => {
    if (!isPointInBbox(lon, lat, bbox)) {
        return false;
    }
    return booleanPointInPolygon([lon, lat], geojson);
};

const isPointInBbox = (lon, lat, bbox) => {
    const minLon = bbox[0];
    const minLat = bbox[1];
    const maxLon = bbox[2];
    const maxLat = bbox[3];
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
};
