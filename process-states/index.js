import fs from "fs";

let data = fs.readFileSync("ne_10m_admin_1_states_provinces.json");
data = JSON.parse(data);

data.features = data.features.filter((feature) => {
    return feature.properties.admin === "United States of America";
});

console.log("data.features.length", data.features.length);

fs.writeFileSync(
    "../web-frontend/src/map/usa-states.json",
    JSON.stringify(data),
);
