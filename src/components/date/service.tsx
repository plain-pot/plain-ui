import PlainService from "../service/service";
import Panel from './pl-date-panel'

export default {
    install(Vue) {
        let controllerService;
        const $plain = Vue.prototype.$plain
        const DateAgent = PlainService.agent()
        const DateService = PlainService.service({
            name: 'pl-date-service',
            emitters: Panel.emitters,
            content: (h, context) => {
                return (
                    <pl-date-panel
                        slot="popper"
                        key={context.count}
                        {...{
                            props: context.options.props,
                            on: context.options.listener,
                        }}/>
                )
            },
            externalListener: {
                change() {
                    if ([
                        'datetime',
                        'dates'
                    ].indexOf(this.options.props.panel) === -1) {
                        this.hide()
                    }
                },
            },
        })
        const DateController = PlainService.factory('pl-date-service-controller', DateService)

        $plain.$date = async (option) => {
            if (!controllerService) {
                controllerService = await $plain.newInstance(DateController)
            }
            return new DateAgent(option, controllerService)
        }
    },
}