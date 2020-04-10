import PlainService from "../../service/service";
import PlColorService from './pl-color-service'
import Panel from '../pl-color-panel.vue'

export default {
    install(Vue) {
        let controllerService;

        let $plain = Vue.prototype.$plain
        const ColorAgent = PlainService.agent()
        const ColorService = PlainService.service({
            name: 'pl-color-service',
            // @ts-ignore
            emitters: Panel.emitters,
            content: (h, context) => {
                return (
                    <pl-color-panel slot="popper"
                                    key={context.count}
                                    {...{
                                        props: context.options.props,
                                        on: context.options.listener,
                                    }}/>
                )
            },
            externalListener: {
                change() {
                    this.hide()
                },
            },
        })

        const ColorController = PlainService.factory('pl-color-service-controller', ColorService)

        $plain.$cs = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(ColorController, PlColorService)
            }
            return new ColorAgent(option, controllerService)
        }
    },
}