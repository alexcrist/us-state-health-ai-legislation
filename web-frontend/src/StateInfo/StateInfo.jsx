import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardSection from "../CardSection/CardSection";
import CardSectionBackButton from "../CardSectionBackButton/CardSectionBackButton";
import CollapsibleLegislation from "../CollapsibleLegislation/CollapsibleLegislation";
import { USA_BBOX } from "../constants";
import mainSlice from "../mainSlice";
import { useFlyToBbox } from "../map/map";

const StateInfo = () => {
    const dispatch = useDispatch();
    const flyToBbox = useFlyToBbox();
    const focusedState = useSelector((state) => state.main.focusedState);

    const onClickBack = () => {
        dispatch(mainSlice.actions.setFocusedState(null));
        flyToBbox(USA_BBOX, { duration: 1000 });
    };

    const legislations = useMemo(() => {
        return focusedState?.legislations ?? [];
    }, [focusedState]);

    if (!focusedState) {
        return null;
    }
    return (
        <>
            <CardSectionBackButton onClick={onClickBack} />
            <CardSection
                title={focusedState?.name}
                descriptions={[
                    `Name: ${focusedState?.name}`,
                    `Legislative Bills: ${legislations.length}`,
                ]}
            />
            <CardSection title={`Legislative Bills (${legislations.length})`}>
                {legislations.map((legislation, index) => {
                    const key = `${legislation[0].data}-${index}`;
                    return (
                        <CollapsibleLegislation
                            legislation={legislation}
                            key={key}
                        />
                    );
                })}
            </CardSection>
        </>
    );
};

export default StateInfo;
