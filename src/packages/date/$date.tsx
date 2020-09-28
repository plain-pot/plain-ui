import {definePopperService} from "@/packages/popper/agent/definePopperService";
import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperServiceComponent} from "@/packages/popper/agent/type";

export const $date = definePopperService(createPopperService({
    name: 'date',
    externalRenderListener: {
        change(this: { _refer: PopperServiceComponent["value"] }) {
            if ([
                'datetime',
                'dates'
            ].indexOf(this._refer!.option.value.props.panel) === -1) {
                this._refer!.option.value.agent.hide()
            }
        },
    },
    render(h, ctx) {
        return (
            <pl-date-panel
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