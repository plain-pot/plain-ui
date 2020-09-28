import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperServiceComponent} from "@/packages/popper/agent/type";
import {definePopperService} from "@/packages/popper/agent/definePopperService";

export const $cascade = definePopperService(createPopperService({
    name: 'cascade',
    externalRenderListener: {
        change(this: { _refer: PopperServiceComponent["value"] }) {
            if (!this._refer!.option.value.props.selectBranch) {
                this._refer!.option.value.agent.hide()
            }
        },
    },
    defaultPopperProps: {
        transition: 'pl-transition-popper-drop',
        arrow: false,
        height: '200px',
    },
    render(h, ctx) {
        return (
            <pl-cascade-panel
                slot="popper"
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