<template>
    <span class="pl-popper" @click="emitClickPopper" @mousedown="emitMousedownPopper">
        <slot></slot>
        <div ref="popper" :class="['pl-popper-el',transition,{[popperClass]:!!popperClass},`pl-popper-el-animate-${transition}`]" :style="popperStyles">
            <transition :name="transition" @after-leave="onAfterLeave" @after-enter="onAfterEnter" @before-enter="onBeforeEnter">
                <div class="plain-popper-content" v-show="p_value" ref="content">
                    <div class="plain-popper-arrow" v-if="arrow"></div>
                    <slot name="popper"></slot>
                </div>
            </transition>
        </div>
    </span>
</template>

<script>

    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";

    /*
    * 1. 不能将 v-show 放在 pl-popper-el 元素上，因为这个元素需要使用 transform来定位，会跟 打开/关闭动画有冲突；
    * 2. 不能根据 打开|关闭状态来设置content的样式，可能会导致打开的时候有弹跳的问题出现；
    * 3. pl-popper-el的pointer-event应该是none，否则会导致遮住页面元素的问题出现；
    */

    import PlainPopper from 'plain-popper'
    import {PopperTrigger} from './pl-popper.ts'

    export default {
        name: "pl-popper",
        mixins: [EmitMixin, PropsMixinFactory({
            hoverOpenDelay: PropsMixinFactory.Number,
            hoverCloseDelay: PropsMixinFactory.Number,
            offset: PropsMixinFactory.Number,
            width: PropsMixinFactory.Number,
            height: PropsMixinFactory.Number,
        })],
        props: {
            value: {type: Boolean},                                     // 双向绑定是否显示
            open: {type: Boolean},                                      // 当前是否显示，与value不同的是，value为false，动画可能才开始关闭，而 open 则是动画结束之后才会派发false出去

            trigger: {type: String, default: 'hover'},                  // hover,click,focus,manual
            title: {type: String},                                      // 标题
            content: {type: String},                                    // 内容
            disabled: {type: Boolean},                                  // 是否可以弹出
            transition: {type: String, default: 'pl-transition-fade'},  // 动画名称：pl-transition-fade, pl-transition-scale, pl-transition-scale-y, pl-transition-popper-drop
            popperClass: {type: String},                                // popper容器节点样式
            offset: {type: [Number, String]},                           // 偏移量
            width: {type: [Number, String]},                            // 宽度
            height: {type: [Number, String]},                           // 高度
            hoverOpenDelay: {type: [Number, String], default: 0},       // hover触发条件下，打开延迟时间
            hoverCloseDelay: {type: [Number, String], default: 200},    // hover触发条件下，关闭延迟时间

            reference: {},                                              // 目标dom元素
            placement: {type: String, default: 'top-start'},            // 位置
            arrow: {type: Boolean, default: true},                      // 是否需要箭头
            boundary: {default: 'window'},                              // 边界元素

            sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
        },
        emitters: {
            emitInput: null,                                            // v-model绑定
            emitUpdateOpen: null,                                       // open属性更新
            emitOpen: null,                                             // 派发打开事件，打开完毕，打开动画执行完毕
            emitClose: null,                                            // 派发关闭事件，关闭完毕，关闭动画执行完毕
            emitInit: null,                                             // 初始化事件，reference el以及popper el已经确认，popper实例已经创建，完成popper el的定位工作
            emitDstry: null,                                            // 销毁事件，popper已经销毁
            emitShow: null,                                             // 打开事件，刚刚打开，动画未结束
            emitHide: null,                                             // 关闭事件，刚刚关闭，动画未结束
            emitClickReference: null,                                   // 点击reference事件
            emitClickPopper: null,                                      // 点击popper的事件
            emitClickPopperContent: null,                               // 点击popper的内容的事件
            emitClickBody: null,                                        // 点击除了reference 以及popper派发的事件
            emitMousedownPopper: null,                                  // 鼠标摁住popperEl派发的事件

            emitEnterReference: null,                                   // trigger为hover下，进入 reference 事件
            emitLeaveReference: null,                                   // trigger为hover下，离开 reference 事件
            emitEnterPopper: null,                                      // trigger为hover下，进入popper事件
            emitLeavePopper: null,                                      // trigger为hover下，离开popper事件
            emitReferenceFocus: null,                                   // trigger为focus下，reference 获取焦点事件
            emitReferenceBlur: null,                                    // trigger为focus下，reference失去焦点事件

            emitBeforeEnter: null,                                      // 展开动画开始之前事件
            emitAfterEnter: null,                                       // 展开动画结束之后事件
            emitAfterLeave: null,                                       // 收起动画结束之后事件
        },
        watch: {
            value(val) {
                if (val === this.p_value) return
                if (val) {
                    this.show(false)
                } else {
                    this.hide(false)
                }
            },
            p_value(val) {
                // 虽然在 onBeforeEnter 里面 refresh一次，但是这里不能去掉，不知道为什么
                if (!!val) {
                    !!this.popper && this.$nextTick(() => this.refresh())
                }
            },
            p_open(val) {
                if (!!val) {
                    this.emitUpdateOpen(true)
                    this.emitOpen()
                } else {
                    this.emitUpdateOpen(false)
                    this.emitClose()
                }
            },
            placement(val) {
                if (!!this.popper) this.popper.setPlacement(val)
            },
            reference() {
                this.dstry()
                this.init()
            },
        },
        computed: {
            popperStyles() {
                const styles = {}
                if (this.p_width != null) {
                    styles.width = this.p_width + 'px'
                }
                if (this.p_height != null) {
                    styles.height = this.p_height + 'px'
                }

                if (!!this.sizeEqual && !!this.referenceEl) {
                    if (['top', 'bottom'].indexOf(this.direction) > -1) {
                        styles.width = this.referenceEl.offsetWidth + 'px'
                    } else if (['left', 'right'].indexOf(this.direction) > -1) {
                        styles.height = this.referenceEl.offsetHeight + 'px'
                    }
                }

                return styles
            },
            direction() {
                const [direction] = this.placement.split('-')
                return direction
            },
        },
        data() {

            const TRIGGERS = {
                hover: () => {
                    this.p_trigger = new PopperTrigger(
                        'hover',
                        /*init*/
                        () => {
                            /*进入reference*/
                            this.p_trigger.data.onEnterReference = () => {
                                if (!!this.p_trigger.data.closeTimer) {
                                    clearTimeout(this.p_trigger.data.closeTimer)
                                    this.p_trigger.data.closeTimer = null
                                }
                                this.p_trigger.data.openTimer = setTimeout(() => {
                                    this.show()
                                    this.p_trigger.data.openTimer = null
                                    this.emitEnterReference(this.p_value)
                                }, this.p_hoverOpenDelay)
                            }
                            /*离开reference*/
                            this.p_trigger.data.onLeaveReference = () => {
                                if (!!this.p_trigger.data.openTimer) {
                                    clearTimeout(this.p_trigger.data.openTimer)
                                    this.p_trigger.data.openTimer = null
                                }
                                this.p_trigger.data.closeTimer = setTimeout(() => {
                                    this.hide()
                                    this.p_trigger.data.closeTimer = null
                                    this.emitLeaveReference(this.p_value)
                                }, this.p_hoverCloseDelay)
                            }
                            /*进入popper*/
                            this.p_trigger.data.onEnterPopper = () => {
                                if (!!this.p_trigger.data.closeTimer) {
                                    clearTimeout(this.p_trigger.data.closeTimer)
                                    this.p_trigger.data.closeTimer = null
                                }
                                this.p_trigger.data.openTimer = setTimeout(() => {
                                    this.show()
                                    this.p_trigger.data.openTimer = null
                                    this.emitEnterPopper(this.p_value)
                                }, this.p_hoverOpenDelay)
                            }
                            /*离开popper*/
                            this.p_trigger.data.onLeavePopper = () => {
                                if (!!this.p_trigger.data.openTimer) {
                                    clearTimeout(this.p_trigger.data.openTimer)
                                    this.p_trigger.data.openTimer = null
                                }
                                this.p_trigger.data.closeTimer = setTimeout(() => {
                                    this.hide()
                                    this.p_trigger.data.closeTimer = null
                                    this.emitLeavePopper(this.p_value)
                                }, this.p_hoverCloseDelay)
                            }
                            this.referenceEl.addEventListener('mouseenter', this.p_trigger.data.onEnterReference)
                            this.referenceEl.addEventListener('mouseleave', this.p_trigger.data.onLeaveReference)
                            this.contentEl.addEventListener('mouseenter', this.p_trigger.data.onEnterPopper)
                            this.contentEl.addEventListener('mouseleave', this.p_trigger.data.onLeavePopper)
                        },
                        /*destroy*/
                        () => {
                            this.referenceEl.removeEventListener('mouseenter', this.p_trigger.data.onEnterReference)
                            this.referenceEl.removeEventListener('mouseleave', this.p_trigger.data.onLeaveReference)
                            this.contentEl.removeEventListener('mouseenter', this.p_trigger.data.onEnterPopper)
                            this.contentEl.removeEventListener('mouseleave', this.p_trigger.data.onLeavePopper)
                        }
                    )

                    this.p_trigger.init()
                },
                click: () => {
                    this.p_trigger = new PopperTrigger(
                        'click',
                        () => {
                            this.p_trigger.data.onClickReference = (e) => {
                                !!this.p_value ? this.hide() : this.show()
                            }
                            this.p_trigger.data.onClickBody = (e) => {
                                if (!!this.p_open) {
                                    this.hide()
                                }
                            }

                            this.$on('click-reference', this.p_trigger.data.onClickReference)
                            this.$on('click-body', this.p_trigger.data.onClickBody)
                        },
                        () => {
                            this.$off('click-reference', this.p_trigger.data.onClickReference)
                            this.$off('click-body', this.p_trigger.data.onClickBody)
                        }
                    )
                    this.p_trigger.init()
                },
                focus: () => {
                    this.p_trigger = new PopperTrigger(
                        'focus',
                        () => {

                            this.p_trigger.data.oldTabIndex = this.referenceEl.getAttribute('tabindex')
                            if (this.p_trigger.data.oldTabIndex == null) {
                                this.referenceEl.setAttribute('tabindex', 0)
                            }

                            this.p_trigger.data.onfocus = () => {
                                this.emitReferenceFocus()
                                this.show()
                            }
                            this.p_trigger.data.onblur = () => {
                                this.emitReferenceBlur()
                                this.hide()
                            }

                            this.referenceEl.addEventListener('focus', this.p_trigger.data.onfocus)
                            this.referenceEl.addEventListener('blur', this.p_trigger.data.onblur)
                        },
                        () => {
                            this.referenceEl.tabIndex = this.p_trigger.data.oldTabIndex
                            this.referenceEl.removeEventListener('focus', this.p_trigger.data.onfocus)
                            this.referenceEl.removeEventListener('blur', this.p_trigger.data.onblur)
                        },
                    )
                    this.p_trigger.init()
                },
                manual: () => {
                    // do nothing
                },
            }

            return {
                TRIGGERS,
                p_trigger: null,
                p_value: false,
                p_open: null,

                popper: null,
                referenceEl: null,
                popperEl: null,
                contentEl: null,

                p_transitionend: null,

                /*---------------------------------------listener-------------------------------------------*/
                onClickReference: (e) => {
                    this.emitClickReference(e)
                },
                onClickPopperContent: (e) => {
                    this.emitClickPopperContent(e)
                },
                onClickBody: (e) => {
                    if (this.referenceEl.contains(e.target)) {
                        /*点击了reference*/
                        return
                    }
                    if (this.contentEl.contains(e.target)) {
                        /*点击了popper*/
                        return
                    }
                    this.emitClickBody(e)
                },
            }
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /**
             * 展开popper
             * @author  韦胜健
             * @date    2020/3/7 0:23
             */
            show(emitInput = true) {
                if (this.p_value) return
                this.p_value = true
                this.emitShow()
                if (emitInput) {
                    this.emitInput(this.p_value)
                }
                this.p_transitionend = () => {
                    this.p_open = true
                    this.p_transitionend = null
                }
            },
            /**
             * 收起popper
             * @author  韦胜健
             * @date    2020/3/7 0:23
             */
            hide(emitInput = true) {
                if (!this.p_value) return
                this.p_value = false
                this.emitHide()
                if (emitInput) {
                    this.emitInput(this.p_value)
                }
                this.p_transitionend = () => {
                    this.p_open = false
                    this.p_transitionend = null
                }
            },
            /**
             * 刷新定位
             * @author  韦胜健
             * @date    2020/3/7 21:43
             */
            refresh() {
                this.popper.refresh()
            },
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 初始化各项信息
             * @author  韦胜健
             * @date    2020/3/7 0:23
             */
            init() {
                const children = Array.from(this.$el.children)

                if (children[0] !== this.$refs.popper) {
                    this.referenceEl = children[0]
                } else if (!!this.reference) {
                    if (this.$plain.utils.typeOf(this.reference) === 'function') {
                        const reference = this.reference()
                        this.referenceEl = reference.$el || reference
                    } else {
                        this.referenceEl = this.reference.$el || this.reference
                    }
                    if (!this.referenceEl) {
                        throw new Error('reference is not a dom element or vue component instance!')
                    }
                } else {
                    /*没有reference，等待reference初始化在初始化popper*/
                    return
                }

                this.popperEl = this.$refs.popper
                this.contentEl = this.$refs.content

                this.popper = new PlainPopper({
                    popperEl: this.popperEl,
                    targetEl: this.referenceEl,
                    arrow: this.arrow,
                    placement: this.placement,
                    offset: this.p_offset,
                    boundary: this.boundary,
                    boxShadow: null,
                    gpuAcceleration:false,
                })

                this._bindEvents()

                if (!this.TRIGGERS[this.trigger]) {
                    console.error(`can not recognise trigger:${this.trigger}`)
                } else {
                    this.TRIGGERS[this.trigger]()
                }

                this.emitInit()

                if (!!this.value) this.$nextTick(() => this.show(false))
            },
            /**
             * 销毁各个实例信息
             * @author  韦胜健
             * @date    2020/3/7 0:23
             */
            dstry() {
                this._unbindEvents()
                if (!!this.p_trigger) {
                    this.p_trigger.destroy()
                }
                if (!!this.popper) {
                    this.popper.destroy()
                }

                this.emitDstry()
            },
            /*---------------------------------------listener-------------------------------------------*/
            /**
             * 动画开始前，先更新popper信息
             * @author  韦胜健
             * @date    2020/3/7 21:36
             */
            onBeforeEnter() {
                this.refresh()
            },
            /**
             * 展开动画结束，标志位 p_open 改为 true
             * @author  韦胜健
             * @date    2020/3/7 21:36
             */
            onAfterEnter() {
                this.p_open = true
            },
            /**
             * 收起动画结束，标志位 p_open 改为 false
             * @author  韦胜健
             * @date    2020/3/7 21:37
             */
            onAfterLeave() {
                this.p_open = false
            },
            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 给 reference 以及 popper绑定点击事件
             * @author  韦胜健
             * @date    2020/3/7 0:24
             */
            _bindEvents() {
                if (this.referenceEl) this.referenceEl.addEventListener('click', this.onClickReference)
                if (this.contentEl) this.contentEl.addEventListener('click', this.onClickPopperContent)
                document.body.addEventListener('click', this.onClickBody)
            },
            /**
             * 解绑 reference 以及 popper点击事件
             * @author  韦胜健
             * @date    2020/3/7 0:24
             */
            _unbindEvents() {
                if (this.referenceEl) this.referenceEl.removeEventListener('click', this.onClickReference)
                if (this.contentEl) this.contentEl.removeEventListener('click', this.onClickPopperContent)
                document.body.removeEventListener('click', this.onClickBody)
            },
        },
        mounted() {
            this.init()
        },
        beforeDestroy() {
            this.dstry()
        }
    }
</script>

<style lang="scss">
</style>