import {createAgentGetter} from "../../popper/edit/createAgentGetter";

export const TimeServiceGetter = createAgentGetter({
    name: 'time',
    render: (attrs) => <pl-time-panel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
})