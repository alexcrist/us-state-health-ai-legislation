import { useEffect } from "react";
import { useAddMapClickListener } from "../map/map";
import Map from "../map/Map/Map";
import styles from "./App.module.css";

const App = () => {
    const addMapClickListener = useAddMapClickListener();
    useEffect(() => {
        return addMapClickListener((event) => {
            console.log("event", event.lngLat.lng);
            console.log("event", event.lngLat.lat);
        });
    }, [addMapClickListener]);

    return (
        <div className={styles.container}>
            <Map />
        </div>
    );
};

export default App;
