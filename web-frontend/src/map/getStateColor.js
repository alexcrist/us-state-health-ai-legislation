import chroma from "chroma-js";
import _ from "lodash";

export const NO_DATA_COLOR = "#FFF";
const SCALE_HUE = "#1a8424";
const COLOR_SCALE = chroma.scale([
    chroma(SCALE_HUE).brighten(2.5),
    chroma(SCALE_HUE).brighten(2),
    chroma(SCALE_HUE).brighten(1.5),
    chroma(SCALE_HUE).brighten(1),
    chroma(SCALE_HUE).brighten(0.5),
    SCALE_HUE,
]);

export const getStateColor = (states, state) => {
    const numLegislations = state.legislations.length;
    if (numLegislations === 0) {
        return NO_DATA_COLOR;
    }
    const maxNumLegislations = _(states).map("legislations.length").maxBy();
    // const scaleFunction = (x) => Math.log2(x - 1);
    const scaleFunction = (x) => x - 1;
    const colorPercent =
        scaleFunction(numLegislations) / scaleFunction(maxNumLegislations);
    return COLOR_SCALE(colorPercent).hex();
};
