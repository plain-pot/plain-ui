import {definePopperService} from "@/packages/popper/agent/definePopperService";
import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperServiceComponent} from "@/packages/popper/agent/type";

export const $colorPicker = definePopperService(createPopperService({
    name: 'color-picker',
    externalRenderListener: {
        change(this: { _refer: PopperServiceComponent["value"] }) {
            this._refer!.option.value.agent.hide()
        },
    },
    render(h, ctx) {
        return (
            <pl-color-panel
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