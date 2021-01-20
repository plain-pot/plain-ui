import {createAgentGetter} from "../popper/edit/createAgentGetter";
import {PlDatePanel} from "./panel/date-panel";

export const DateServiceGetter = createAgentGetter({
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