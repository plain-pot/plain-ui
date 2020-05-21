import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, watch} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";
import PlainPopper from "../../../submodules/plain-popper";
import {$plain} from "@/packages/base";
import {ElRef, useRefs} from "@/use/useRefs";
import {PlainPlacementType} from "../../../submodules/plain-popper/types";
import {getTrigger, PopperTrigger, PopperTriggerType} from "@/packages/popper/PopperTrigger";
import {StyleType} from "@/types/utils";
import {SlotFunc, useSlots} from "@/use/useSlots";

export const PLAIN_POPPER_PROVIDER = '@@PLAIN_POPPER_PROVIDER'

/*
* 1. 不能将 v-show 放在 pl-popper-el 元素上，因为这个元素需要使用 transform来定位，会跟 打开/关闭动画有冲突；
* 2. 不能根据 打开|关闭状态来设置content的样式，可能会导致打开的时候有弹跳的问题出现；
* 3. pl-popper-el的pointer-event应该是none，否则会导致遮住页面元素的问题出现；
*/

export default defineComponent({
    name: 'pl-popper',
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
        noContentPadding: {type: Boolean},                          // 去掉默认内容内边距

        reference: {type: [Function, Element]},                     // 目标dom元素
        placement: {type: String, default: 'top-start'},            // 位置
        arrow: {type: Boolean, default: true},                      // 是否需要箭头
        boundary: {default: 'window'},                              // 边界元素

        sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
        rootProps: {type: Object},                                  // 根节点dom元素的属性
    },
    setup(props) {

        const refs = useRefs({
            el: ElRef,
            popper: ElRef,
            content: ElRef,
        })

        const {slots} = useSlots({
            popper: SlotFunc,
        })

        const {emit, on, off} = useEvent({
            input: EmitFunc,                                        // v-model绑定
            updateOpen: EmitFunc,                                   // open属性更新
            open: EmitFunc,                                         // 派发打开事件，打开完毕，打开动画执行完毕
            close: EmitFunc,                                        // 派发关闭事件，关闭完毕，关闭动画执行完毕
            init: EmitFunc,                                         // 初始化事件，reference el以及popper el已经确认，popper实例已经创建，完成popper el的定位工作
            dstry: EmitFunc,                                        // 销毁事件，popper已经销毁
            show: EmitFunc,                                         // 打开事件，刚刚打开，动画未结束
            hide: EmitFunc,                                         // 关闭事件，刚刚关闭，动画未结束

            clickReference: EmitFunc,                               // 点击reference事件
            clickPopper: EmitFunc,                                  // 点击popper的事件
            clickPopperContent: EmitFunc,                           // 点击popper的内容的事件
            clickBody: EmitFunc,                                         // 点击除了reference 以及popper派发的事件
            mousedownPopper: EmitFunc,                              // 鼠标摁住popperEl派发的事件

            enterReference: EmitFunc,                               // trigger为hover下，进入 reference 事件
            leaveReference: EmitFunc,                               // trigger为hover下，离开 reference 事件
            enterPopper: EmitFunc,                                  // trigger为hover下，进入popper事件
            leavePopper: EmitFunc,                                  // trigger为hover下，离开popper事件
            referenceFocus: EmitFunc,                               // trigger为focus下，reference 获取焦点事件
            referenceBlur: EmitFunc,                                // trigger为focus下，reference失去焦点事件

            beforeEnter: EmitFunc,                                  // 展开动画开始之前事件
            afterEnter: EmitFunc,                                   // 展开动画结束之后事件
            afterLeave: EmitFunc,                                   // 收起动画结束之后事件
        })

        /*---------------------------------------state-------------------------------------------*/

        const propsState = useProps(props, {
            hoverOpenDelay: FormatPropsType.number,
            hoverCloseDelay: FormatPropsType.number,
            offset: FormatPropsType.number,
            width: FormatPropsType.number,
            height: FormatPropsType.number,
        })

        const model = useModel(() => props.value, emit.input, false)
        const open = useModel(() => props.open, emit.updateOpen, false)

        const state = reactive({
            trigger: null as PopperTrigger | null,
            popper: null as PlainPopper | null,
            referenceEl: null as Element | null,
            popperEl: null as HTMLElement | null,
            contentEl: null as HTMLElement | null,
            onTransitionend: null as Function | null,

            zIndex: 0,
        })

        /*---------------------------------------computer-------------------------------------------*/

        const direction = computed(() => {
            const [direction] = props.placement.split('-')
            return direction
        })

        const popperStyles = computed(() => {
            const styles = {} as StyleType
            styles.zIndex = String(state.zIndex)
            if (propsState.width != null) {
                styles.width = propsState.width + 'px'
            }
            if (propsState.height != null) {
                styles.height = propsState.height + 'px'
            }

            if (!!props.sizeEqual && !!state.referenceEl) {
                if (['top', 'bottom'].indexOf(direction.value) > -1) {
                    styles.width = (state.referenceEl as HTMLElement).offsetWidth + 'px'
                } else if (['left', 'right'].indexOf(direction.value) > -1) {
                    styles.height = (state.referenceEl as HTMLElement).offsetHeight + 'px'
                }
            }

            return styles
        })

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            show: (emitInput: boolean = true) => {
                if (model.value) return
                state.zIndex = $plain.nextIndex()
                model.value = true
                emit.show()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    open.value = true
                    state.onTransitionend = null
                }
            },
            hide: (emitInput: boolean = true) => {
                if (!model.value) return
                model.value = false
                emit.hide()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    open.value = false
                    state.onTransitionend = null
                }
            },
            refersh: () => {
                if (!state.referenceEl) return
                state.popper!.refresh()
            },
        }

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            init() {
                const children = Array.from(refs.el.children)

                if (children[0] !== refs.popper) {
                    state.referenceEl = children[0]
                } else if (!!props.reference) {
                    if (typeof props.reference === 'function') {
                        // @ts-ignore
                        const reference = props.reference()
                        state.referenceEl = reference.$el || reference
                    } else {
                        // @ts-ignore
                        state.referenceEl = props.reference.$el || props.reference
                    }
                } else {
                    /*没有reference，等待reference初始化在初始化popper*/
                    return
                }

                state.popperEl = refs.popper
                state.contentEl = refs.content

                state.popper = new PlainPopper({
                    popperEl: state.popperEl,
                    targetEl: state.referenceEl as HTMLElement,
                    arrow: props.arrow,
                    placement: props.placement as PlainPlacementType,
                    offset: propsState.offset,
                    boundary: props.boundary,
                    boxShadow: undefined,
                })

                utils.bindEvents()

                state.trigger = getTrigger(props.trigger as PopperTriggerType, {
                    model,
                    open,
                    show: methods.show,
                    hide: methods.hide,

                    emitEnterReference: emit.enterReference,
                    emitLeaveReference: emit.leaveReference,
                    emitEnterPopper: emit.enterPopper,
                    emitLeavePopper: emit.leavePopper,

                    hoverOpenDelay: propsState.hoverOpenDelay,
                    hoverCloseDelay: propsState.hoverCloseDelay,
                    reference: state.referenceEl as HTMLElement,
                    popper: state.popperEl,

                    emitReferenceFocus: emit.referenceFocus,
                    emitReferenceBlur: emit.referenceBlur,

                    on,
                    off,
                })

                state.trigger.init()
                emit.init()

                if (!!model.value) {
                    $plain.nextTick(() => methods.show(false))
                }
            },
            dstry: () => {
                utils.unbindEvents()
                if (!!state.trigger) {
                    state.trigger.destroy()
                }
                if (!!state.popper) {
                    state.popper.destroy()
                }
                emit.dstry()
            },
            bindEvents: () => {
                if (!!state.referenceEl) {
                    state.referenceEl.addEventListener('click', handler.clickReference)
                }
                if (!!state.contentEl) {
                    state.contentEl.addEventListener('click', handler.clickPopperContent)
                }
                document.body.addEventListener('click', handler.clickBody)
            },
            unbindEvents: () => {
                if (!!state.referenceEl) {
                    state.referenceEl.removeEventListener('click', handler.clickReference)
                }
                if (!!state.contentEl) {
                    state.contentEl.removeEventListener('click', handler.clickPopperContent)
                }
                document.body.removeEventListener('click', handler.clickBody)
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            clickReference: (e: Event) => {
                emit.clickReference(e)
            },
            clickPopperContent: (e: Event) => {
                emit.clickPopperContent(e)
            },
            clickBody: (e: Event) => {
                if (state.referenceEl!.contains(e.target as Node)) {
                    /*点击了reference*/
                    return
                }
                if (state.contentEl!.contains(e.target as Node)) {
                    /*点击了content*/
                    return
                }
                emit.clickBody(e)
            },

            beforeEnter: () => {
                methods.refersh()
            },
            afterEnter: () => {
                open.value = true
            },
            afterLeave: () => {
                open.value = false
            },
        }

        /*---------------------------------------watch-------------------------------------------*/
        watch(() => props.value, (val) => {
            if (val === model.value) {
                return
            }
            if (val) {
                methods.show(false)
            } else {
                methods.hide(false)
            }
        }, {lazy: true})

        watch(() => model.value, (val) => {
            if (!!val) {
                if (!!state.popper) {
                    $plain.nextTick(() => {
                        methods.refersh()
                    })
                }
            }
        }, {lazy: true})

        watch(() => open.value, (val) => {
            if (!!val) {
                emit.updateOpen(true)
                emit.open()
            } else {
                emit.updateOpen(false)
                emit.close()
            }
        }, {lazy: true})

        watch(() => props.placement, (val) => {
            if (!!state.popper) {
                state.popper.setPlacement(val as PlainPlacementType)
            }
        }, {lazy: true})

        watch(() => props.reference, () => {
            utils.dstry()
            utils.init()
        }, {lazy: true})

        watch(() => props.arrow, () => {
            $plain.nextTick(() => {
                utils.dstry()
                utils.init()
            })
        }, {lazy: true})

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            utils.init()
        })

        onBeforeUnmount(() => {
            utils.dstry()
        })

        return () => (
            <span class={"pl-popper"} onClick={emit.clickPopper} onMousedown={emit.mousedownPopper} {...{props: props.rootProps}} show={model.value} ref={"el"}>
                {slots.default()}
                <div ref={"popper"}
                     class={['pl-popper-el', props.transition, {[props.popperClass as string]: !!props.popperClass}, `pl-popper-el-animate-${props.transition}`]}
                     style={popperStyles.value}>
                     <transition name={props.transition} onAfterLeave={handler.afterLeave} onAfterEnter={handler.afterEnter} onBeforeEnter={handler.beforeEnter}>
                        <div {...{directives: [{name: 'show', value: model.value}]}}
                             ref="content"
                             class={['plain-popper-content', {'plain-popper-content-no-padding': props.noContentPadding}]}>
                            {!!props.arrow && <div class="plain-popper-arrow"/>}
                            {slots.popper()}
                        </div>
                    </transition>
                </div>
            </span>
        )
    },
})