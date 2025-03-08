import styles from "./Attributions.module.css";

const ATTRIBUTIONS = [
    {
        key: "Country and State Borders",
        value: "Natural Earth",
        url: "https://www.naturalearthdata.com/",
    },
    {
        key: "Software Dependencies",
        values: [
            {
                name: "MapLibre",
                url: "https://maplibre.org/",
            },
            {
                name: "React",
                url: "https://react.dev/",
            },
            {
                name: "Redux",
                url: "https://redux.js.org/",
            },
            {
                name: "Vite",
                url: "https://vite.dev/",
            },
            {
                name: "Turf.js",
                url: "https://turfjs.org/",
            },
            {
                name: "Lodash",
                url: "https://lodash.com/",
            },
        ],
    },
];

export const Attributions = () => {
    return (
        <div className={styles.attributions}>
            {ATTRIBUTIONS.map(({ key, values, value, url }, index) => {
                return (
                    <div key={index} className={styles.attribution}>
                        {values && (
                            <>
                                <div className={styles.attributionKey}>
                                    {key}:
                                </div>
                                <ul>
                                    {values.map(({ name, url }, index) => {
                                        return (
                                            <li key={index}>
                                                <div>{name}</div>
                                                <div
                                                    className={styles.line}
                                                ></div>
                                                <a
                                                    href={url}
                                                    target="_"
                                                    rel="noreferrer"
                                                    className={
                                                        styles.attributionUrl
                                                    }
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        )}
                        {value && (
                            <div>
                                <div className={styles.attributionKey}>
                                    {key}:
                                </div>
                                <div className={styles.attributionValue}>
                                    {value}
                                </div>
                            </div>
                        )}
                        {url && (
                            <a
                                href={url}
                                target="_"
                                rel="noreferrer"
                                className={styles.attributionUrl}
                            >
                                {url}
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
