import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

export const eventsState = atom({
    key: 'eventsState',
    default: []
});

export const useEvents = (func = () => {}) => {
    const [events, setEvents] = useRecoilState(eventsState);

    useEffect(() => {
        if (events.length === 0) return;
        func(events[events.length - 1]);
    }, [events]);

    const fire = (eventText, eventType) => {
        const event = {
            text: eventText,
            type: eventType
        };
        setEvents([...events, event]);
    }

    return {events, fire};
}