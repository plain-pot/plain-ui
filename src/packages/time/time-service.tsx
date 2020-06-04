import {usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {usePopperController} from "../popper/service/PopperController";
import {usePopperAgent} from "../popper/service/PopperAgent";

export default {
    install(Vue) {
        let controllerService;

        const $plain = Vue.prototype.$plain

        const TimeServiceComponent = usePopperServiceComponent({
            name: 'pl-time-service',
            content: (h, ctx) => {
                return (
                    <pl-time-panel
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
        })

        const TimeController = usePopperController('pl-time-service-controller', TimeServiceComponent)

        $plain.$time = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(TimeController)
            }
            return usePopperAgent(option, controllerService)
        }
    },
}