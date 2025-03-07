import Header from "../Header/Header";
import InfoCard from "../InfoCard/InfoCard";
import Map from "../map/Map/Map";
import styles from "./App.module.css";

const App = () => {
    return (
        <div className={styles.container}>
            <Header isMobile />
            <div className={styles.content}>
                <div className={styles.infoCardContainer}>
                    <Header />
                    <InfoCard />
                </div>
                <Map />
            </div>
        </div>
    );
};

export default App;
