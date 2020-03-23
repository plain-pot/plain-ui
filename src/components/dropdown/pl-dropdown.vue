<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";
    import DropdownWrapper from './pl-dropdown-wrapper'

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
            emitEnterPopper: Function,
            emitLeavePopper: Function,
        },
        props: {
            trigger: {type: String, default: 'click'},                      // click, focus, hover, manual
            width: {type: [String, Number]},
            height: {type: [String, Number]},

            hoverOpenDelay: {type: [Number, String], default: 0},           // hover触发条件下，打开延迟时间
            hoverCloseDelay: {type: [Number, String], default: 200},        // hover触发条件下，关闭延迟时间
        },
        data() {
            return {
                service: null,
                el: null,
                popperOption: {
                    reference: () => this.$el,
                    popperProps: {
                        noContentPadding: true,
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
                        if (!!this.$scopedSlots.default) {
                            return wrapper(this.$scopedSlots.default())
                        }
                    },
                },

                triggers: {
                    click: {
                        init: (el) => {
                            this.el = el
                            this.triggerHandler = {click: () => this.isShow ? this.hide() : this.show()}
                            this.el.addEventListener('click', this.triggerHandler.click)
                        },
                        destroy: () => {
                            this.el.removeEventListener('click', this.triggerHandler.click)
                        },
                    },
                    hover: {
                        init: (el) => {
                            this.el = el
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
                        init: (el) => {
                            this.el = el
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
                    manual: {},
                },
            }
        },
        computed: {
            isShow: {
                cache: false,
                get() {
                    if (!this.service) {
                        return false
                    } else {
                        return this.service.isShow()
                    }
                },
            },
            isOpen: {
                cache: false,
                get() {
                    if (!this.service) return false
                    return this.service.isOpen()
                },
            },
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
                        })
                    },
                }
            },
        },
        render() {
            return this.$slots.default[0]
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
            if (!!this.triggers[this.trigger]) {
                this.triggers[this.trigger].init(this.$el)
            }
        },
        beforeDestroy() {
            if (!!this.triggers[this.trigger]) {
                this.triggers[this.trigger].destroy()
            }

            if (!!this.service) {
                this.service.destroy()
            }
        },
        updated() {
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