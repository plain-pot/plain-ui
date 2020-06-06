import {usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {usePopperController} from "@/packages/popper/service/PopperController";
import {usePopperAgent} from "@/packages/popper/service/PopperAgent";

export default {
    install(Vue) {
        let controllerService;

        const $plain = Vue.prototype.$plain

        const ServiceComponent = usePopperServiceComponent({
            name: 'pl-date-service',
            content: (h, ctx) => {
                return (
                    <pl-date-panel
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
            externalListener: {
                change() {
                    if ([
                        'datetime',
                        'dates'
                    ].indexOf((this as any).options.value.props.panel) === -1) {
                        this.hide()
                    }
                },
            }
        })

        const Controller = usePopperController('pl-date-service-controller', ServiceComponent)

        $plain.$date = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(Controller)
            }
            return usePopperAgent(option, controllerService)
        }
    },
}