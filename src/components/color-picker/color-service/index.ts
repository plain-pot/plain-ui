import PlainService from "../../service";
import PlColorService from './pl-color-service'

export default {
    install(Vue) {
        let controller;
        let $plain = Vue.prototype.$plain
        const ColorAgent = PlainService.agent()

        $plain.$cs = (option) => {
            if (!controller) {
                controller = $plain.newInstance(PlainService.factory('pl-color-service-controller', PlColorService))
            }
            return new ColorAgent(option, controller)
        }
    },
}