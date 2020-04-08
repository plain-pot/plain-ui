import Controller from './pl-cascade-controller.vue'

type CascadeTrigger = 'click' | 'hover'

export interface CascadeOption {
    value: string,                                              // 当前颜色值
    private: boolean | Function                                 // 是否为私有实例
    reference: HTMLElement,                                     // 目标元素
    popperProps: object,                                        // popper组件绑定属性

    beforeShow: Function                                        // 打开之前钩子函数
    beforeHide: Function                                        // 关闭之前钩子函数

    data: object[]                                              // 数组，双向绑定值
    trigger: CascadeTrigger                                     // 选择的数据
    hoverDebounce: number                                       // 展开触发类型：click，hover
    emptyText: string                                           // 触发器为hover的时候，防抖时间间隔
    nodeDisabled: Function                                        // 没有子节点时展示的文本
    renderContent: Function                                     // 是否禁用判断函数
    isLeaf: Function                                            // 渲染内容的渲染函数
    lazy: boolean                                               // 函数，用来判断是否为叶子节点，默认根据节点是否存在子节点来判断是否为叶子节点，懒加载模式下，改属性为必需属性
    getChildren: Function                                       // 数据是否为懒加载
    labelField: string                                          // 懒加载数据函数
    keyField: string                                            // 记录显示文本的字段名
    childrenField: string                                       // 记录值的字段名
    filterText: string                                          // 筛选文本
    filterMethod: Function                                      // 自定义筛选方法
}

export class Cascade {
    ins = null

    constructor(public option: CascadeOption, public controller) {
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
        $plain.$cascade = (option) => {
            if (!controller) {
                controller = $plain.newInstance(Controller)
            }
            return new Cascade(option, controller)
        }
    },
}