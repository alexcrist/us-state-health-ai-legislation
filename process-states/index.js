import fs from "fs";

let data = fs.readFileSync("ne_10m_admin_1_states_provinces.json");
data = JSON.parse(data);

data.features = data.features.map((feature) => {
    // Transform Puerto Rico data to match other US state data
    if (feature.properties.admin === "Puerto Rico") {
        feature.properties.admin = "United States of America";
        feature.properties.postal = "PR";
    }
    return feature;
});

data.features = data.features.filter((feature) => {
    const { admin } = feature.properties;
    return admin === "United States of America";
});

console.info("Number of states exported:", data.features.length);

fs.writeFileSync(
    "../web-frontend/src/map/usa-states.json",
    JSON.stringify(data),
);
