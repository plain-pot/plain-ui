import PlainService from "../service/service";
import Panel from './pl-time-panel.vue'

export default {
    install(Vue) {
        let controllerService;

        let $plain = Vue.prototype.$plain
        const TimeAgent = PlainService.agent()
        const TimeService = PlainService.service({
            name: 'pl-time-service',
            // @ts-ignore
            emitters: Panel.emitters,
            content(h, context) {
                return (
                    <pl-time-panel
                        slot="popper"
                        key={context.count}
                        {...{
                            props: context.options.props,
                            on: context.options.listener,
                        }}/>
                )
            },
        })

        const TimeController = PlainService.factory('pl-time-service-controller', TimeService)
        $plain.$time = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(TimeController)
            }
            return new TimeAgent(option, controllerService)
        }
    },
}