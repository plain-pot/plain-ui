import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {PopperAgentOption, PopperServiceComponent} from "@/packages/popper/agent/type";
import {createPopperController, PopperController} from "@/packages/popper/agent/createPopperController";
import {$plain} from "@/packages/base";
import {usePopperAgent} from "@/packages/popper/agent/createPopperAgent";

export const $cascade = (() => {
    const Service = createPopperService({
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

    const Controller = createPopperController('cascade', Service)
    let controller: { _refer: PopperController["value"] }

    return (optionGetter: () => PopperAgentOption) => {
        if (!controller) {
            controller = $plain.newInstance(Controller)
        }
        return usePopperAgent(optionGetter, controller)
    }
})()