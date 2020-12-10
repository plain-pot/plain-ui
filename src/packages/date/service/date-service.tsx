import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {DatePanelType} from "../panel/date-panel";

export const DateServiceGetter = createAgentGetter({
    name: 'date',
    render: (attrs) => <pl-date-panel {...attrs}/>,
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        async onChange() {
            let renderAttrs: any = this.state.option.serviceOption.renderAttrs
            if (typeof renderAttrs === "function") renderAttrs = renderAttrs()
            if (!(
                renderAttrs.panel === DatePanelType.datetime ||
                renderAttrs.panel === DatePanelType.dates ||
                renderAttrs.range
            )) {
                this.hide()
            }
        },
    },
})