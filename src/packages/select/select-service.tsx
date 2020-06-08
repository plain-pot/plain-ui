import {PopperServiceComponent, usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {usePopperController} from "@/packages/popper/service/PopperController";
import {usePopperAgent} from "@/packages/popper/service/PopperAgent";

export default {
    install(Vue) {
        let controllerService;

        const $plain = Vue.prototype.$plain

        const ServiceComponent = usePopperServiceComponent({
            name: 'pl-select-service',
            content: (h, ctx) => {
                return (
                    <pl-select-panel
                        ref="panel"
                        slot="popper"
                        key={ctx.state.count}
                        {
                            ...{
                                props: ctx.options.value.props,
                                on: ctx.options.value.listener,
                            }
                        }
                    />
                )
            },
            defaultPopperProps: {
                noContentPadding: true,
                sizeEqual: true,
                transition: 'pl-transition-popper-drop',
                arrow: false,
                offset: 3,
            },
            externalListener: {
                change(this: PopperServiceComponent, val: string) {
                    if (!this.options.value.props.multiple) {
                        this.hide()
                    }
                },
            }
        })

        const Controller = usePopperController('pl-select-service-controller', ServiceComponent)

        $plain.$select = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(Controller)
            }
            return usePopperAgent(option, controllerService)
        }
    },
}