import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {PlTimePanel} from "../panel/time-panel";

export const TimeServiceGetter = createAgentGetter({
    name: 'time',
    render: (attrs) => <PlTimePanel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
})