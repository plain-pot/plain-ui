import Container from './pl-message-container.vue'

import {PlainUtils} from "@/util/util";
import {$plain} from "@/packages/base";

export default class MessageService {

    _el: HTMLElement | null
    containers: object
    defaultOption: any

    get el() {
        if (!this._el) {
            this._el = document.createElement('div')
            PlainUtils.addClass(this._el, 'pl-message-containers')
            document.body.appendChild(this._el)
        }
        return this._el
    }

    constructor() {

        this._el = null;
        this.containers = {}
        this.defaultOption = {
            id: null,
            horizontal: 'center',
            vertical: 'start',
            status: 'primary',
            time: 3000,
            done: null,
            click: null,
            icon: null,
        }
    }

    newInstance(horizontal, vertical) {
        const instance = $plain.newInstance(Container)
        instance.p_horizontal = horizontal
        instance.p_vertical = vertical
        this.el.appendChild(instance.$el)
        return instance
    }

    close(messageOption) {
        this.containers[`${messageOption.horizontal}-${messageOption.vertical}`].remove(messageOption)
    }

    /**
     * 显示提示消息
     * @author  韦胜健
     * @date    2018/12/24 09:58
     */
    show(message, option) {
        option = option || {}
        switch (PlainUtils.typeOf(message)) {
            case 'number':
                message = String(message)
            case 'string':
                option.message = message
                break
            case 'object':
                option = message
                break;
        }
        option = Object.assign({}, this.defaultOption, option)
        option.id = option.id || PlainUtils.uuid()

        const position = `${option.horizontal}-${option.vertical}`
        const container = this.containers[position] || this.newInstance(option.horizontal, option.vertical)
        if (!this.containers[position]) this.containers[position] = container

        $plain.nextTick().then(() => container.add(option))
        return option
    }

    static install(Vue) {
        const messageService = new MessageService()
        const $message = (message, option = {}) => messageService.show(message, option)
        Object.keys($plain.STATUS).forEach(status => $message[status] = (message, option = {}) => messageService.show(message, {status, ...option}))
        Vue.prototype.$message = $message
    }
}
