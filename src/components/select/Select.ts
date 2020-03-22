export interface SelectOption {
    value: any                                                  // 当前值
    data: Array<string>                                         // 选择的数组数据
    private?: Boolean | Function                                // 是否为私有实例
    reference: HTMLElement                                      // 目标元素
    popoverProps: any                                           // popover组件参数

    labelKey: string                                            // 显示文本的key
    valueKey: string                                            // 实际值key
    groupKey: string                                            // 选项是否为分组key
    disabledKey: string                                         // 是否禁用key
    iconKey: string                                             // 图标key

    render: Function                                            // 自定义渲染内容的key

    autoClose: boolean                                          // 点击之后是否自关闭
    closeAfterBody: boolean                                     // 点击除了reference 以及 popper之外的元素之后，是否自动关闭
    keyboard: boolean                                           // 打开之后，是否启用select服务的自动响应键盘操作功能

    onClick: Function                                           // 点击选项钩子函数
    onShow: Function                                            // 准备打开的钩子函数
    onHide: Function                                            // 准备关闭的钩子函数
    onClickBody: Function                                       // 点击除了reference以及popper之外的body的钩子函数
    onOpen: Function                                            // 打开结束的钩子函数
    onClose: Function                                           // 关闭结束的钩子函数
    onItemMousedown: Function                                   // 点击选项，鼠标mousedown事件

    beforeShow: Function                                        // 打开之前钩子函数
    beforeHide: Function                                        // 关闭之前钩子函数
}

export default class Select {

    ins = null                                                   // select service item 实例

    constructor(public option: SelectOption, public controller) {
        option.autoClose = option.autoClose === undefined ? true : option.autoClose
        option.closeAfterBody = option.closeAfterBody === undefined ? true : option.closeAfterBody
        option.keyboard = option.keyboard === undefined ? true : option.keyboard
    }

    /*打开select*/
    async show() {
        if (this.isShow()) return

        if (!this.ins) {
            this.ins = await this.controller.getInstance()
        }
        this.ins.bind(this)
        this.ins.show()
    }

    /*收起select*/
    hide() {
        if (!this.isShow()) return
        this.ins.hide()
    }

    /*打开/收起select*/
    toggle() {
        if (!!this.isShow()) {
            this.hide()
        } else {
            this.show()
        }
    }

    /*高亮上一条*/
    prev() {
        if (!!this.ins) {
            this.ins.prev()
        }
    }

    /*高亮下一条*/
    next() {
        if (!!this.ins) {
            this.ins.next()
        }
    }

    /*选中当前高亮行*/
    selectCurrentItem() {
        if (!!this.ins) {
            this.ins.selectCurrentItem()
        }
    }

    /*当前是否展开*/
    isShow() {
        if (!this.ins) return false
        return this.ins.isShow
    }

    /*当前是否已经展开完毕*/
    isOpen() {
        if (!this.ins) return false
        return this.ins.isOpen
    }

    destroy() {
        if (this.isShow()) {
            this.hide()
        }
        if (!!this.ins) {
            this.ins.unbind(this)
        }
    }
}