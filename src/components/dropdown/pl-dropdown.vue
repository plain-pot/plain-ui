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
            const that = this
            return {
                service: null,
                el: null,
                popperOption: {
                    reference: () => this.$el,
                    popperProps: {
                        noContentPadding: true,
                    },
                    render: (h) => {

                        const wrapper = (content) => {
                            return (
                                <DropdownWrapper {...that.wrapperBinding}>
                                    {!this.p_height ?
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
                        init(el) {
                            that.el = el
                            this.handler = {click: () => that.isShow ? that.hide() : that.show(),}
                            that.el.addEventListener('click', this.handler.click)
                        },
                        destroy() {
                            that.el.removeEventListener('click', this.handler.click)
                        },
                    },
                    hover: {
                        init(el) {
                            that.el = el
                            this.handler = {
                                'enter-reference': () => {
                                    if (!!this.closeTimer) {
                                        clearTimeout(this.closeTimer)
                                        this.closeTimer = null
                                    }
                                    this.openTimer = setTimeout(() => {
                                        that.show()
                                        this.openTimer = null
                                    }, that.p_hoverOpenDelay)
                                },
                                'leave-reference': () => {
                                    if (!!this.openTimer) {
                                        clearTimeout(this.openTimer)
                                        this.openTimer = null
                                    }
                                    this.closeTimer = setTimeout(() => {
                                        that.hide()
                                        this.closeTimer = null
                                    }, that.p_hoverCloseDelay)
                                },
                                'enter-popper': () => {
                                    if (!!this.closeTimer) {
                                        clearTimeout(this.closeTimer)
                                        this.closeTimer = null
                                    }
                                    this.openTimer = setTimeout(() => {
                                        that.show()
                                        this.openTimer = null
                                    }, that.p_hoverOpenDelay)
                                },
                                'leave-popper': () => {
                                    if (!!this.openTimer) {
                                        clearTimeout(this.openTimer)
                                        this.openTimer = null
                                    }
                                    this.closeTimer = setTimeout(() => {
                                        that.hide()
                                        this.closeTimer = null
                                    }, that.p_hoverCloseDelay)
                                },
                            }
                            that.el.addEventListener('mouseenter', this.handler["enter-reference"])
                            that.el.addEventListener('mouseleave', this.handler["leave-reference"])
                            that.$on('enter-popper', this.handler["enter-popper"])
                            that.$on('leave-popper', this.handler["leave-popper"])
                        },
                        destroy() {
                            that.el.removeEventListener('mouseenter', this.handler["enter-reference"])
                            that.el.removeEventListener('mouseleave', this.handler["leave-reference"])
                            that.$off('enter-popper', this.handler["enter-popper"])
                            that.$off('leave-popper', this.handler["leave-popper"])
                        },
                    },
                    focus: {
                        init(el) {
                            this.el = el
                            this.handler = {click: () => that.isShow ? that.hide() : that.show(),}
                            this.el.addEventListener('click', this.handler.click)
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
                const that = this
                return {
                    style: {
                        ...(!this.p_width ? {} : {width: this.$plain.utils.suffixPx(this.p_width)}),
                        ...(!this.p_height ? {} : {height: this.$plain.utils.suffixPx(this.p_height)}),
                    },
                    on: {
                        'click-item': (data) => {
                            that.onClickItem(data)
                        },
                    },
                    nativeOn: {
                        ...(this.trigger !== 'hover' ? {} : {
                            mouseenter: (e) => that.emitEnterPopper(e),
                            mouseleave: (e) => that.emitLeavePopper(e),
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
                if (!this.service) {
                    this.service = await this.$popper(this.popperOption)
                }
                this.service.show()
            },
            hide() {
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