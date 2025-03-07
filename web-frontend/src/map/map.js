import maplibre from "maplibre-gl";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAP_CONTAINER_ID, WATER_FILL_COLOR } from "../constants";
import mainSlice from "../mainSlice";
import {
    addCountriesLayer,
    useCountriesGeojson,
    useLakesGeojson,
} from "./countries";
import { addStatesLabelsLayer, addStatesLayer, useStates } from "./states";

let map = null;

export const getMap = () => map;

export const useInitMap = () => {
    const dispatch = useDispatch();
    const states = useStates();
    const countriesGeojson = useCountriesGeojson();
    const lakesGeojson = useLakesGeojson();
    useEffect(() => {
        if (!states || !countriesGeojson || !lakesGeojson) {
            return;
        }
        map = new maplibre.Map({
            container: MAP_CONTAINER_ID,
            style: {
                glyphs: "./{fontstack}/{range}.pbf",
                layers: [
                    {
                        id: "background",
                        type: "background",
                        paint: { "background-color": WATER_FILL_COLOR },
                    },
                ],
                sources: {},
                version: 8,
            },
            center: [0, 0],
            zoom: 2,
            minZoom: 2,
        });

        // Use globe projection
        map.on("style.load", () => {
            map.setProjection({ type: "globe" });
        });

        // Set map as initialized upon loading
        map.on("load", async () => {
            await addCountriesLayer(map);
            await addStatesLayer(map);
            await addStatesLabelsLayer(map);
            dispatch(mainSlice.actions.setIsMapInitialized(true));
        });

        // Clean up
        return () => {
            dispatch(mainSlice.actions.setIsMapInitialized(false));
            map.remove();
            map = null;
        };
    }, [countriesGeojson, dispatch, lakesGeojson, states]);
};

// Safeguards map utility functions from being called before the map has
// been initialized
const useCreateMapUtilityFunction = () => {
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    return useCallback(
        (fn) => {
            if (!isMapInitialized || map === null) {
                return () => null;
            }
            const returnValue = fn();

            // If return-value is a clean-up function, safeguard it as well
            if (typeof returnValue === "function") {
                return () => {
                    if (!isMapInitialized || map === null) {
                        return;
                    }
                    returnValue();
                };
            }

            return returnValue;
        },
        [isMapInitialized],
    );
};

export const useMapResize = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(() => {
        return createMapUtilityFunction(() => {
            map.resize();
        });
    }, [createMapUtilityFunction]);
};

export const useAddMapEventListener = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (eventName, callbackFn) => {
            return createMapUtilityFunction(() => {
                map.on(eventName, callbackFn);
                return () => map.off(eventName, callbackFn);
            });
        },
        [createMapUtilityFunction],
    );
};

export const useAddMapClickListener = () => {
    const addMapEventListener = useAddMapEventListener();
    return useCallback(
        (callbackFn) => addMapEventListener("click", callbackFn),
        [addMapEventListener],
    );
};

const DEFAULT_RENDER_GEO_JSON_OPTIONS = {
    strokeColor: "black",
    strokeOpacity: 1,
    strokeWidth: 2,
    fillColor: "white",
    fillOpacity: 0.5,
};

export const useRenderGeoJson = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (geojson, options, beforeLayerId) => {
            return createMapUtilityFunction(() => {
                return addGeoJsonLayer(map, geojson, options, beforeLayerId);
            });
        },
        [createMapUtilityFunction],
    );
};

export const addGeoJsonLayer = (
    map,
    geojson,
    options = DEFAULT_RENDER_GEO_JSON_OPTIONS,
    beforeLayerId,
) => {
    const getOption = (key) => {
        return options[key] ?? DEFAULT_RENDER_GEO_JSON_OPTIONS[key];
    };
    const sourceId = `geo-json-${Math.random()}`;
    const fillLayerId = `${sourceId}-fill`;
    const strokeLayerId = `${sourceId}-stroke`;
    map.addSource(sourceId, { type: "geojson", data: geojson });
    map.addLayer(
        {
            id: fillLayerId,
            type: "fill",
            source: sourceId,
            paint: {
                "fill-color": getOption("fillColor"),
                "fill-opacity": getOption("fillOpacity"),
            },
        },
        beforeLayerId,
    );
    map.addLayer(
        {
            id: strokeLayerId,
            type: "line",
            source: sourceId,
            paint: {
                "line-color": getOption("strokeColor"),
                "line-opacity": getOption("strokeOpacity"),
                "line-width": getOption("strokeWidth"),
            },
        },
        beforeLayerId,
    );
    return () => {
        map.removeLayer(fillLayerId);
        map.removeLayer(strokeLayerId);
        map.removeSource(sourceId);
    };
};

const DEFAULT_FLY_TO_BBOX_OPTIONS = { duration: 1000 };

export const useFlyToBbox = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (bbox, options = DEFAULT_FLY_TO_BBOX_OPTIONS) => {
            return createMapUtilityFunction(() => {
                map.fitBounds(
                    [
                        [bbox[0], bbox[1]],
                        [bbox[2], bbox[3]],
                    ],
                    options,
                );
            });
        },
        [createMapUtilityFunction],
    );
};

const DEFAULT_FLY_TO_POINT_OPTIONS = {};

export const useFlyToPoint = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (lon, lat, zoom, options = DEFAULT_FLY_TO_POINT_OPTIONS) => {
            return createMapUtilityFunction(() => {
                map.flyTo({
                    center: [lon, lat],
                    zoom: zoom,
                    ...options,
                });
            });
        },
        [createMapUtilityFunction],
    );
};

export const useZoomTo = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (zoom) => {
            return createMapUtilityFunction(() => {
                map.flyTo({ zoom });
            });
        },
        [createMapUtilityFunction],
    );
};

export const useGetLonLatFromPoint = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (x, y) => {
            return createMapUtilityFunction(() => {
                const coord = map.unproject([x, y]);
                return [coord.lng, coord.lat];
            });
        },
        [createMapUtilityFunction],
    );
};

export const useGetPointFromLonLat = () => {
    const createMapUtilityFunction = useCreateMapUtilityFunction();
    return useCallback(
        (lon, lat) => {
            return createMapUtilityFunction(() => {
                const coord = map.project([lon, lat]);
                return [coord.x, coord.y];
            });
        },
        [createMapUtilityFunction],
    );
};
