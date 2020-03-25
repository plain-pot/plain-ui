import {plugin} from "../../utils";
import Container from './pl-notice-container.vue'
import {NoticeServiceOption} from "./NoticeService";

const NoticeService = {
    install(Vue) {
        const $plain = Vue.prototype.$plain
        let containers = {};

        const notice = async (message: string | NoticeServiceOption, option: NoticeServiceOption) => {
            if (typeof message === 'object') {
                option = message
            } else {
                // @ts-ignore
                option = option || {}
                option.message = String(message)
            }
            if (option.status === undefined) {
                option.status = 'primary'
            }
            if (!option.id) {
                option.id = $plain.utils.uuid()
            }
            if (!option.vertical) {
                option.vertical = 'start'
            }
            if (!option.horizontal) {
                option.horizontal = 'end'
            }

            let container = containers[`${option.vertical}-${option.horizontal}`]
            if (!container) {
                container = await $plain.newInstance(Container)
                container.vertical = option.vertical
                container.horizontal = option.horizontal
                containers[`${option.vertical}-${option.horizontal}`] = container
                await $plain.nextTick()
            }

            return container.newService(option)
        }

        Object.keys($plain.STATUS).forEach(status => {
            notice[status] = (message: string | NoticeServiceOption, option: NoticeServiceOption) => {
                // @ts-ignore
                return notice(message, {status, ...(option || {})})
            }
        })

        Vue.prototype.$notice = notice
    },
}

export default plugin([], [NoticeService])