import {definePopperService} from "@/packages/popper/agent/definePopperService";
import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperServiceComponent} from "@/packages/popper/agent/type";

export const $select = definePopperService(createPopperService({
    name: 'select',
    defaultPopperProps: {
        noContentPadding: true,
        sizeEqual: true,
        transition: 'pl-transition-popper-drop',
        arrow: false,
        offset: 3,
    },
    externalRenderListener: {
        change(this: { _refer: PopperServiceComponent["value"] }) {
            if (!this._refer!.option.value.props.multiple) {
                this._refer!.option.value.agent.hide()
            }
        },
    },
    render(h, ctx) {
        return (
            <pl-select-panel
                ref="panel"
                slot="popper"
                key={ctx._refer!.state.count}
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