<template>
    <pl-dom v-if="p_init">
        <transition :name="`pl-popover-animate-${animate}`">
            <div class="pl-popper" v-show="p_value" :class="classes" :style="styles" ref="popper">
                <slot></slot>
            </div>
        </transition>
    </pl-dom>
</template>

<script>

    import Popper from 'popper.js'
    import {MountedMixin, ValueMixin} from "../../mixin/component-mixin";
    import PlDom from "../pl-dom";

    const POPOVER_DIRECTION = {
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right',
    }
    const POPOVER_ALIGN = {
        START: 'start',
        CENTER: 'center',
        END: 'end',
    }

    export default {
        name: "pl-popper",
        components: {PlDom},
        mixins: [MountedMixin, ValueMixin],
        props: {
            reference: {},

            direction: {type: String, default: POPOVER_DIRECTION.BOTTOM},           //弹出框的方向：top|bottom|left|right
            align: {type: String, default: POPOVER_ALIGN.START},                    //弹出框的对其方式
            arrow: {type: Boolean},                                                 //弹出框是否带小三角
            offset: {type: Number, default: 2},                                       //弹出框与载体的距离
            animate: {type: String, default: 'drop'},                               //弹出框显隐动画
            height: {default: 180},                                                 //弹出框的高度
            width: {default: 180},                                                  //弹出框的宽度
            windowBoundary: {type: Boolean, default: true},                         //边界为window
            disabledEqual: {type: Boolean},                                         //弹出框是否与载体在方向上大小相同
            disabledHideOnClickOutside: {type: Boolean},                            //禁用点击外部的时候关闭
            relate: {type: Array, default: () => []},                               //点击外部元素的时候，relate中数组的元素不会触发关闭动作
            zIndex: {type: Number, default: 9999},                                  //基础zIndex
            cls: {type: String},                                                    //样式

            onOpen: {type: Function},                                               //打开动画结束之后的动作
            onClose: {type: Function},                                              //关闭动画结束之后的动作
            onShow: {type: Function},                                               //打开立即执行动作
            onHide: {type: Function},                                               //关闭立即执行动作
        },
        watch: {
            value(val) {
                if (!!val) this.show()
                else this.hide()
            },
            direction(val) {
                this.p_direction = val
                this.init()
            },
            align(val) {
                this.p_align = val
                this.init()
            },
            arrow() {
                this.init()
            },
            reference() {
                this.init()
            },
        },
        data() {
            return {
                p_open: false,
                p_show: false,

                p_init: false,
                p_popper: null,
                p_direction: this.direction,
                p_align: this.align,
                p_zIndex: null,
            }
        },
        computed: {
            classes() {
                return [
                    {
                        'pl-popper-arrow': !!this.arrow,
                        'pl-popper-is-open': !!this.p_open,
                        [this.cls]: !!this.cls,
                    },
                    `pl-popper-${this.p_direction}-${this.p_align}`,
                ]
            },
            styles() {
                if (!this.p_mounted || !this.referenceEl) return
                const ret = {}
                !!this.height && (ret.height = this.$plain.$utils.unit(this.height))
                !!this.width && (ret.width = this.$plain.$utils.unit(this.width))
                if (!this.disabledEqual && this.p_mounted) ret[this.p_vertical ? 'width' : 'height'] = `${this.referenceEl[this.p_vertical ? 'offsetWidth' : 'offsetHeight']}px`
                ret.zIndex = this.p_zIndex + this.zIndex
                return ret
            },
            p_vertical() {
                return this.$plain.$utils.oneOf(this.p_direction, ['top', 'bottom'])
            },
            p_relate() {
                return [this.referenceEl, this.$refs.popper, ...(this.relate || [])]
            },
            referenceEl() {
                if (!this.p_mounted) return
                return !this.reference ? null : (this.reference.$el || this.reference)
            },
        },
        methods: {
            async show() {
                if (!this.p_init) {
                    this.p_init = true
                    await this.$plain.nextTick()
                }
                if (!this.p_popper) this.init()
                this.p_value = true
                await this.$plain.nextTick()
                this.p_popper.update()
                this.p_zIndex = this.$plain.getZIndex()
                this.$emit('show')
                this.p_show = true
                !!this.onShow && this.onShow()
                this.pl_event()
            },
            async hide() {
                this.p_value = false
                await this.$plain.nextTick()
                this.$emit('hide')
                !!this.onHide && this.onHide()
                this.pl_event()
            },
            async toggle() {
                return this.p_value ? (await this.hide()) : (await this.show())
            },
            reload() {
                this.init()
            },
            init() {
                if (!this.p_init) return
                this.destroy()
                this.p_popper = new Popper(this.referenceEl, this.$refs.popper, {
                    placement: `${this.p_direction}-${this.p_align}`,
                    modifiers: {
                        offset: {offset: `0,${this.offset == null ? this.arrow ? 10 : '0' : this.offset}`,},
                        preventOverflow: this.windowBoundary ? {boundariesElement: 'window'} : null,
                        computeStyle: {gpuAcceleration: false},
                    },
                    onUpdate: () => this.p_refresh(),
                    onCreate: () => this.p_refresh(),
                })
                window.addEventListener('click', this.p_clickWindow)
            },
            destroy() {
                if (!!this.p_popper) {
                    this.p_popper.destroy()
                    this.p_popper = null
                }
                window.removeEventListener('click', this.p_clickWindow)
            },
            p_refresh() {
                let placement = this.p_popper.popper.getAttribute('x-placement').split('-');
                this.p_direction = placement[0];
                this.p_align = placement[1];
            },
            pl_event() {
                setTimeout(() => {
                    this.p_open = this.p_value
                    if (this.p_open) {
                        !!this.onOpen && (this.onOpen())
                        this.$emit('open')
                        this.$emit('input', true)
                    } else {
                        !!this.onClose && (this.onClose())
                        this.$emit('close')
                        this.$emit('input', false)
                        this.p_show = false
                    }
                }, 250)
            },
            async p_clickWindow(e) {
                if (!this.disabledHideOnClickOutside && !this.p_relate.some(el => el.contains(e.target))) this.hide()
            },
        },
        beforeDestroy() {
            this.destroy()
        },
    }
</script>

<style lang="scss">
</style>
