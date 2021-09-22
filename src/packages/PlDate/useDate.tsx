
import {PlDatePanel} from "./panel/PlDatePanel";
import {createUseEditPopperAgent} from "../useEditPopperAgent/createAgentGetter";

export const useDate = createUseEditPopperAgent({
    name: 'date',
    render: (attrs) => <PlDatePanel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        async onChange() {
            let renderAttrs: any = this.state.option.serviceOption.renderAttrs
            if (typeof renderAttrs === "function") renderAttrs = renderAttrs()
            if (!(
                renderAttrs.datetime ||
                renderAttrs.multiple ||
                renderAttrs.range
            )) {
                this.hide()
            }
        },
    },
})
