
import {createUseEditPopperAgent} from "../useEditPopperAgent/createAgentGetter";
import {PlTimePanel} from "./panel/PlTimePanel";

export const useTime = createUseEditPopperAgent({
    name: 'time',
    render: (attrs) => <PlTimePanel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
})
