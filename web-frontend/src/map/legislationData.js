import Papa from "papaparse";
import { sanitizeStateCode } from "./sanitizeStateCode";

const GOOGLE_SHEETS_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vROLf4I2rKj9Aw04Ca25hQH2N6IMGAGutw2skJ1Fn19UDXKVeDIxT1N0sG84QDKKg/pub?gid=928600437&single=true&output=csv";

const getColumn = (csvRow, columnLetter) => {
    const columnIndex = columnLetter.toLowerCase().charCodeAt(0) - 97;
    return csvRow[columnIndex];
};

const getLegislation = (csvRow) => {
    return [
        {
            label: "Bill Number",
            data: getColumn(csvRow, "C"),
        },
        {
            label: "Bill Title",
            data: getColumn(csvRow, "D"),
        },
        {
            label: "Bill Status",
            data: getColumn(csvRow, "E"),
        },
        {
            label: "Date Enacted",
            data: getColumn(csvRow, "F"),
        },
        {
            label: "Effective Date",
            data: getColumn(csvRow, "G"),
        },
        {
            label: "Category",
            data: getColumn(csvRow, "H"),
        },
        {
            label: "Bill Summary",
            data: getColumn(csvRow, "I"),
        },
    ];
};

const CSV_PROMISE = (async () => {
    let csvRows = [];
    try {
        const res = await fetch(GOOGLE_SHEETS_URL);
        const csvText = await res.text();
        const { data } = Papa.parse(csvText);
        // Ignore header row
        csvRows = data.slice(1);
    } catch (error) {
        alert("Error fetching legislation data CSV.");
        console.error(error);
    }
    return csvRows;
})();

export const STATE_CODE_TO_LEGISLATIONS_MAP_PROMISE = (async () => {
    const csvRows = await CSV_PROMISE;
    const map = {};
    for (const csvRow of csvRows) {
        const stateCode = sanitizeStateCode(getColumn(csvRow, "B"));
        const legislation = getLegislation(csvRow);
        map[stateCode] ??= [];
        map[stateCode].push(legislation);
    }
    return map;
})();
