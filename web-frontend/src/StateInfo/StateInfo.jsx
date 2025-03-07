import { useDispatch, useSelector } from "react-redux";
import CardSection from "../CardSection/CardSection";
import CardSectionBackButton from "../CardSectionBackButton/CardSectionBackButton";
import { USA_BBOX } from "../constants";
import mainSlice from "../mainSlice";
import { useFlyToBbox } from "../map/map";

const StateInfo = () => {
    const dispatch = useDispatch();
    const flyToBbox = useFlyToBbox();
    const focusedState = useSelector((state) => state.main.focusedState);
    if (!focusedState) {
        return null;
    }
    const onClickBack = () => {
        dispatch(mainSlice.actions.setFocusedState(null));
        flyToBbox(USA_BBOX, { duration: 1000 });
    };

    // TODO
    const datasets = [];

    return (
        <>
            <CardSectionBackButton onClick={onClickBack} />
            <CardSection
                title={focusedState?.name}
                descriptions={[
                    `State Name: ${focusedState?.name}`,
                    `Number of Datasets: ${datasets.length}`,
                ]}
            />
            <CardSection title={`Datasets (${datasets.length})`}>
                TODO
            </CardSection>
        </>
    );
};

export default StateInfo;
