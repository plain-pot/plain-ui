<template>
    <div class="pl-select-service-controller">
        <pl-select-service-item v-for="(index) in items" :key="index"/>
    </div>
</template>

<script lang="ts">
    import PlSelectServiceItem from "./pl-select-service-item.vue";

    interface SelectOption {
        value: any                                                  // 当前值
        data: Array<string>                                         // 选择的数组数据
        private?: Boolean                                           // 是否为私有实例
        reference: HTMLElement                                      // 目标元素
        popoverProps: any                                           // popover组件参数
        labelKey: string                                            // 显示文本的key
        valueKey: string                                            // 实际值key
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

    class Select {

        ins = null                                                   // select service item 实例

        constructor(public opt: SelectOption, public controller) {
            opt.autoClose = opt.autoClose === undefined ? true : opt.autoClose
            opt.closeAfterBody = opt.closeAfterBody === undefined ? true : opt.closeAfterBody
            opt.keyboard = opt.keyboard === undefined ? true : opt.keyboard
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
    }

    export default {
        name: "pl-select-service-controller",
        components: {PlSelectServiceItem},
        provide() {
            return {
                selectController: this,
            }
        },
        props: {},
        data() {
            return {
                items: [],                                          // 数字数组，用来控制 select-service-item 个数
                insList: [],                                        // select-service-item 实例数组
            }
        },
        computed: {
            /*当前可用的 select-service-item 实例数组*/
            availableInsList() {
                return (this.insList || []).filter(ins => !ins.openFlag && !ins.private)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*创建一个select对象*/
            newSelect(opt: SelectOption) {
                return new Select(opt, this)
            },

            /*---------------------------------------listener-------------------------------------------*/
            /*select-service-item初始化*/
            addItem(item) {
                this.insList.push(item)
            },
            /*select-service-item销毁*/
            removeItem(item) {
                let index = this.insList.indexOf(item)
                if (index > -1) {
                    this.insList.splice(index, 1)
                }
            },

            /*---------------------------------------utils-------------------------------------------*/
            /*获取一个没有使用的 service item实例*/
            async getInstance() {
                let instance;

                if (this.availableInsList.length === 0) {
                    this.items.push(this.items.length)
                    await this.$plain.nextTick()
                }

                instance = this.availableInsList[0]

                return instance
            },
        },
    }
</script>

<style lang="scss">
    .pl-select-service-controller {
        height: 0;
        width: 0;
    }
</style>