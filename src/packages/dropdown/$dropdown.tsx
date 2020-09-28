import {definePopperService} from "@/packages/popper/agent/definePopperService";
import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperServiceComponent} from "@/packages/popper/agent/type";

export const $dropdown = definePopperService(createPopperService({
    name: 'dropdown',
    defaultPopperProps: {
        noContentPadding: true,
    },
    externalRenderListener: {
        'click-item'(this: { _refer: PopperServiceComponent["value"] }) {
            if (this._refer!.option.value.props.closeOnClickItem !== false) {
                this._refer!.option.value.agent.hide()
            }
        },
    },
    hideOnClickBody: false,
    render(h, ctx) {
        return (
            <pl-dropdown-content
                slot="popper"
                key={ctx._refer!.option.value.agent.state.showCount}
                {
                    ...{
                        props: ctx._refer!.option.value.props,
                        on: ctx._refer!.option.value.targetListener,
                    }
                }
            />
        )
    },
}))