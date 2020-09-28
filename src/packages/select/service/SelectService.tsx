import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {createPopperController, PopperController} from "@/packages/popper/agent/createPopperController";
import {PopperAgentOption, PopperServiceComponent} from "@/packages/popper/agent/type";
import {$plain} from "@/packages/base";
import {usePopperAgent} from "@/packages/popper/agent/usePopperAgent";

export const $select = (() => {

    const Service = createPopperService({
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
    })

    const Controller = createPopperController('select', Service)
    let controller: { _refer: PopperController["value"] }

    return (optionGetter: () => PopperAgentOption) => {
        if (!controller) {
            controller = $plain.newInstance(Controller)
        }
        return usePopperAgent(optionGetter, controller)
    }
})()