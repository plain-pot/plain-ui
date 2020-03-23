<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";
    import DropdownWrapper from './pl-dropdown-wrapper.vue'

    export default {
        name: "pl-dropdown",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                width: PropsMixinFactory.Number,
                height: PropsMixinFactory.Number,

                hoverOpenDelay: PropsMixinFactory.Number,
                hoverCloseDelay: PropsMixinFactory.Number,
            }),
        ],
        emitters: {
            emitInput: Function,
            emitEnterPopper: Function,
            emitLeavePopper: Function,
            emitClickWindow: Function,
            emitClickPopper: Function,
            emitClickReference: Function,
            emitClickBody: Function,
        },
        props: {
            value: {type: Boolean},                                         // model绑定是否打开下拉列表
            trigger: {type: String, default: 'click'},                      // click, focus, hover, manual
            width: {type: [String, Number]},                                // popper 宽度
            height: {type: [String, Number]},                               // popper高度

            hoverOpenDelay: {type: [Number, String], default: 0},           // hover触发条件下，打开延迟时间
            hoverCloseDelay: {type: [Number, String], default: 200},        // hover触发条件下，关闭延迟时间
        },
        watch: {
            isShow: {
                immediate: true,
                async handler(val) {
                    await this.$plain.nextTick()
                    if (!!this.$el) {
                        this.$el.setAttribute('pl-dropdown', val ? 'open' : 'close')
                    }
                },
            },
            value(val) {
                this.p_value = val
                if (!!val) {
                    this.show()
                } else {
                    this.hide()
                }
            },
        },
        data() {
            return {
                service: null,                                              // $popper 创建的 popper对象
                el: null,                                                   // 当前组件的 $el 对象
                p_value: this.value,                                        // model 绑定缓存值
                isShow: false,                                              // 下拉列表是否show
                isOpen: false,                                              // 下拉列表是否open

                /**
                 * 点击window事件
                 * @author  韦胜健
                 * @date    2020/3/23 14:52
                 */
                onClickWindow: (e) => {
                    this.emitClickWindow(e)

                    if (!this.isShow) {
                        return
                    }
                    if (!!this.service && !!this.service.ins) {
                        if (this.service.ins.$el.contains(e.target)) {
                            // click popper
                            return this.emitClickPopper()
                        }
                        if (this.el.contains(e.target)) {
                            // click reference
                            return this.emitClickReference()
                        }
                        // click body
                        this.emitClickBody()

                        if (this.trigger !== 'manual') {
                            this.hide()
                        }
                    }
                },
                /**
                 * 创建 popper service的参数对象
                 * @author  韦胜健
                 * @date    2020/3/23 14:53
                 */
                popperOption: {
                    reference: () => this.$el,
                    popperProps: {
                        noContentPadding: true,
                    },
                    on: {
                        show: () => {
                            this.isShow = true
                            this.p_value = true
                            this.emitInput(this.p_value)
                        },
                        hide: () => {
                            this.isShow = false
                            this.p_value = false
                            this.emitInput(this.p_value)
                        },
                        open: () => this.isOpen = true,
                        close: () => this.isOpen = false,
                    },
                    render: (h) => {
                        const that = this

                        const wrapper = (content) => {
                            return (
                                <DropdownWrapper {...that.wrapperBinding}>
                                    {!that.p_height ?
                                        content :
                                        <pl-scroll>
                                            {content}
                                        </pl-scroll>
                                    }
                                </DropdownWrapper>
                            )
                        }

                        if (!!this.$slots.dropdown) {
                            return wrapper(this.$slots.dropdown)
                        }

                        return null
                    },
                },

                /**
                 * 各种触发器的初始化以及销毁逻辑
                 * @author  韦胜健
                 * @date    2020/3/23 14:54
                 */
                triggers: {
                    click: {
                        init: () => {
                            this.triggerHandler = {
                                click: () => this.isShow ? this.hide() : this.show(),
                            }
                            this.el.addEventListener('click', this.triggerHandler.click)
                        },
                        destroy: () => {
                            this.el.removeEventListener('click', this.triggerHandler.click)
                        },
                    },
                    hover: {
                        init: () => {
                            this.triggerHandler = {
                                'enter-reference': () => {
                                    if (!!this.triggerHandler.closeTimer) {
                                        clearTimeout(this.triggerHandler.closeTimer)
                                        this.triggerHandler.closeTimer = null
                                    }
                                    this.triggerHandler.openTimer = setTimeout(() => {
                                        this.show()
                                        this.triggerHandler.openTimer = null
                                    }, this.p_hoverOpenDelay)
                                },
                                'leave-reference': () => {
                                    if (!!this.triggerHandler.openTimer) {
                                        clearTimeout(this.triggerHandler.openTimer)
                                        this.triggerHandler.openTimer = null
                                    }
                                    this.triggerHandler.closeTimer = setTimeout(() => {
                                        this.hide()
                                        this.triggerHandler.closeTimer = null
                                    }, this.p_hoverCloseDelay)
                                },
                                'enter-popper': () => {
                                    if (!!this.triggerHandler.closeTimer) {
                                        clearTimeout(this.triggerHandler.closeTimer)
                                        this.triggerHandler.closeTimer = null
                                    }
                                    this.triggerHandler.openTimer = setTimeout(() => {
                                        this.show()
                                        this.triggerHandler.openTimer = null
                                    }, this.p_hoverOpenDelay)
                                },
                                'leave-popper': () => {
                                    if (!!this.triggerHandler.openTimer) {
                                        clearTimeout(this.triggerHandler.openTimer)
                                        this.triggerHandler.openTimer = null
                                    }
                                    this.triggerHandler.closeTimer = setTimeout(() => {
                                        this.hide()
                                        this.triggerHandler.closeTimer = null
                                    }, this.p_hoverCloseDelay)
                                },
                            }
                            this.el.addEventListener('mouseenter', this.triggerHandler["enter-reference"])
                            this.el.addEventListener('mouseleave', this.triggerHandler["leave-reference"])
                            this.$on('enter-popper', this.triggerHandler["enter-popper"])
                            this.$on('leave-popper', this.triggerHandler["leave-popper"])
                        },
                        destroy: () => {
                            this.el.removeEventListener('mouseenter', this.triggerHandler["enter-reference"])
                            this.el.removeEventListener('mouseleave', this.triggerHandler["leave-reference"])
                            this.$off('enter-popper', this.triggerHandler["enter-popper"])
                            this.$off('leave-popper', this.triggerHandler["leave-popper"])
                        },
                    },
                    focus: {
                        init: () => {
                            this.triggerHandler = {
                                focus: () => this.show(),
                                blur: () => setTimeout(() => this.hide(), 200),
                            }
                            this.el.addEventListener('focus', this.triggerHandler.focus)
                            this.el.addEventListener('blur', this.triggerHandler.blur)
                        },
                        destroy: () => {
                            this.el.removeEventListener('focus', this.triggerHandler.focus)
                            this.el.removeEventListener('blur', this.triggerHandler.blur)
                        },
                    },
                    manual: {
                        init: () => {
                        },
                        destroy: () => {
                        },
                    },
                },
            }
        },
        computed: {
            /**
             * dropdown-wrapper组件参数
             * @author  韦胜健
             * @date    2020/3/23 14:55
             */
            wrapperBinding() {
                return {
                    style: {
                        ...(!this.p_width ? {} : {width: this.$plain.utils.suffixPx(this.p_width)}),
                        ...(!this.p_height ? {} : {height: this.$plain.utils.suffixPx(this.p_height)}),
                    },
                    on: {
                        'click-item': (data) => {
                            // console.log(this._uid)
                            this.onClickItem(data)
                        },
                    },
                    nativeOn: {
                        ...(this.trigger !== 'hover' ? {} : {
                            mouseenter: (e) => this.emitEnterPopper(e),
                            mouseleave: (e) => this.emitLeavePopper(e),
                        }),
                    },
                }
            },
        },
        render() {
            if (!!this.$slots.default && !!this.$slots.default[0]) return this.$slots.default[0]
            else if (!!this.$scopedSlots.default) return this.$scopedSlots.default({show: this.isShow, open: this.isOpen})
            return null
        },
        methods: {
            async show() {
                if (this.isShow) return
                if (!this.service) {
                    this.service = await this.$popper(this.popperOption)
                }
                this.service.show()
            },
            hide() {
                if (!this.isShow) return
                this.service.hide()
            },
            toggle() {
                if (!this.isShow) {
                    this.show()
                } else {
                    this.hide()
                }
            },
            /*---------------------------------------handler-------------------------------------------*/
            onClickItem() {
                this.hide()
            },
        },
        mounted() {
            // 初始化 trigger
            if (!!this.triggers[this.trigger]) {
                this.el = this.$el
                this.triggers[this.trigger].init()
            }
            window.addEventListener('click', this.onClickWindow)
        },
        beforeDestroy() {
            // 销毁 trigger
            if (!!this.triggers[this.trigger]) {
                this.triggers[this.trigger].destroy()
            }

            // 销毁 popper service
            if (!!this.service) {
                this.service.destroy()
            }

            window.removeEventListener('click', this.onClickWindow)
        },
        updated() {
            // 如果 $el 发生变化，重新初始化 trigger
            if (!!this.el && this.el !== this.$el) {
                if (!!this.triggers[this.trigger]) {
                    this.triggers[this.trigger].destroy()
                    this.el = this.$el
                    this.triggers[this.trigger].init()
                }
            }
        }
    }
</script>

<style lang="scss">
</style>