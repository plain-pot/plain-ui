import {usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {usePopperController} from "../popper/service/PopperController";
import {usePopperAgent} from "../popper/service/PopperAgent";

export default {
    install(Vue) {
        let controllerService;

        const $plain = Vue.prototype.$plain

        const ColorServiceComponent = usePopperServiceComponent({
            name: 'pl-cascade-service',
            content: (h, ctx) => {
                return (
                    <pl-cascade-panel
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
                    // @ts-ignore
                    if (!this.options.value.props.selectBranch) {
                        this.hide()
                    }
                },
            },
            defaultPopperProps: {
                transition: 'pl-transition-popper-drop',
                arrow: false,
                height: '200px',
            }
        })

        const ColorController = usePopperController('pl-cascade-service-controller', ColorServiceComponent)

        $plain.$cascade = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(ColorController)
            }
            return usePopperAgent(option, controllerService)
        }
    },
}