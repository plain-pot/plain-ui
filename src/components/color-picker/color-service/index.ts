import PlainService from "../../service";
import PlColorService from './pl-color-service'

type ColorFormat = 'rgb' | 'hex'

export interface ColorOption {
    value: string,                                              // 当前颜色值
    private: boolean | Function                                 // 是否为私有实例
    reference: HTMLElement,                                     // 目标元素
    popperProps: object,                                        // popper组件绑定属性

    beforeShow: Function                                        // 打开之前钩子函数
    beforeHide: Function                                        // 关闭之前钩子函数

    enableAlpha: boolean                                        // 是否启用透明度
    format: ColorFormat                                         // 颜色格式
}

export class Color {
    ins = null

    constructor(public option: ColorOption, public controller) {
    }

    async show() {
        if (this.isShow()) return
        if (!this.isOpen()) {
            this.ins = await this.controller.getInstance()
            this.ins.bind(this)
        }
        this.ins.show()
    }

    hide(): void {
        if (!this.isShow()) return
        this.ins.hide()
    }

    toggle(): void {
        if (!!this.isShow()) {
            this.hide()
        } else {
            this.show()
        }
    }

    isShow(): boolean {
        if (!this.ins) return false
        return this.ins.isShow
    }

    isOpen(): boolean {
        if (!this.ins) return false
        return this.ins.isOpen
    }

    destroy(): void {
        if (this.isShow()) {
            this.hide()
        }
        if (!!this.ins) {
            this.ins.unbind(this)
        }
    }
}

export default {
    install(Vue) {
        let controller;
        let $plain = Vue.prototype.$plain
        $plain.$cs = (option) => {
            if (!controller) {
                controller = $plain.newInstance(PlainService.factory('pl-color-service-controller', PlColorService))
            }
            return new Color(option, controller)
        }
    },
}