import {createAgentGetter} from "../../popper/edit/createAgentGetter";

export const TimeServiceGetter = createAgentGetter({
    name: 'time',
    render: (attrs) => <pl-time-panel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        async onChange() {
            let renderAttrs: any = this.state.option.serviceOption.renderAttrs
            if (typeof renderAttrs === "function") renderAttrs = renderAttrs()
            if (!renderAttrs.range) {
                this.hide()
            }
        },
    },
})