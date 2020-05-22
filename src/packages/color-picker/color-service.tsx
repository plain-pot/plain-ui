import {usePopperAgent} from "@/packages/popper/service/PopperAgent";
import {usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {usePopperController} from "@/packages/popper/service/PopperController";

export default {
    install(Vue) {

        let controllerService;

        const $plain = Vue.prototype.$plain

        const ColorServiceComponent = usePopperServiceComponent({
            name: 'pl-color-service',
            content: (h, ctx) => {
                return (
                    <pl-color-panel
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
                    this.hide()
                },
            }
        })

        const ColorController = usePopperController('pl-color-service-controller', ColorServiceComponent)

        $plain.$cs = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(ColorController)
            }
            return usePopperAgent(option, controllerService)
        }

    },
}