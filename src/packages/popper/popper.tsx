import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, watch} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";
import {PlainPopper} from "../../../src-doc/page/plain-popper/PlainPopper";
import {ElRef, useRefs} from "@/use/useRefs";
import {PopperTrigger} from "@/packages/popper/PopperTrigger";
import {StyleType} from "@/types/utils";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {$plain} from "@/packages/base";
import {PlainPlacementType} from "../../../submodules/plain-popper/types";

export const PLAIN_POPPER_PROVIDER = '@@PLAIN_POPPER_PROVIDER'

export const POPPER_PROPS = {
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
    placement: {type: String, default: 'bottom-start'},            // 位置
    arrow: {type: Boolean, default: true},                      // 是否需要箭头
    boundary: {default: 'window'},                              // 边界元素

    sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
    rootProps: {type: Object},                                  // 根节点dom元素的属性
}

/*
* 1. 不能将 v-show 放在 pl-popper-el 元素上，因为这个元素需要使用 transform来定位，会跟 打开/关闭动画有冲突；
* 2. 不能根据 打开|关闭状态来设置content的样式，可能会导致打开的时候有弹跳的问题出现；
* 3. pl-popper-el的pointer-event应该是none，否则会导致遮住页面元素的问题出现；
*/

export default defineComponent({
    name: 'pl-popper',
    props: {
        ...POPPER_PROPS,
    },
    setup(props) {

        const refs = useRefs({
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

        const model = useModel(() => props.value, emit.input, false, false)
        const openModel = useModel(() => props.open, emit.updateOpen, false, false)

        const state = reactive({
            trigger: null as PopperTrigger | null,
            referenceEl: null as HTMLElement | null,
            popperEl: null as HTMLElement | null,

            popper: null as PlainPopper | null,
            zIndex: $plain.nextIndex(),
            init: false,
            ready: false,

            onTransitionend: null as Function | null,
        })

        /*---------------------------------------computer-------------------------------------------*/

        const direction = computed(() => {
            const [direction] = props.placement.split('-')
            return direction
        })

        const classes = computed(() => [
            'pl-popper',
            props.transition,
            {
                'pl-popper-show': model.value,
                'pl-popper-ready': state.ready,
            }
        ])

        const popperStyles = computed(() => {
            const styles = {} as StyleType
            styles.zIndex = String(state.zIndex)
            return styles
        })

        const popperClasses = computed(() => [
            'plain-popper',
            {
                'plain-popper-show': model.value
            }
        ])

        const contentStyles = computed(() => {
            const styles = {} as StyleType
            propsState.height != null && (styles.height = `${propsState.height}px`);
            propsState.width != null && (styles.width = `${propsState.width}px`);

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
            show: async (emitInput: boolean = true) => {

                if (model.value) {
                    return
                }

                if (!state.init) {
                    state.init = true
                    await $plain.nextTick()
                    await utils.initPopper()
                    await $plain.utils.delay(23)
                    state.ready = true
                }

                state.zIndex = $plain.nextIndex()
                await $plain.nextTick()
                model.value = true
                emit.show()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    openModel.value = true
                    state.onTransitionend = null
                }
            },
            hide: (emitInput: boolean = true) => {

                if (!model.value) {
                    return
                }
                model.value = false
                emit.hide()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    openModel.value = false
                    state.onTransitionend = null
                }
            },
            toggle: async () => {
                model.value ? await methods.hide() : await methods.show()
            },
            refresh: () => {
                if (!state.referenceEl) return
                state.popper!.refresh()
            },
        }

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            async init() {
                state.referenceEl = utils.getReferenceEl()
                if (!state.referenceEl) {
                    return
                }
                state.referenceEl.addEventListener('click', handler.clickReference)
            },
            async initPopper() {
                state.popper = new PlainPopper({
                    popper: refs.popper,
                    reference: state.referenceEl!,
                    padding: 50,
                    placement: props.placement as any,
                })
            },
            destroy: () => {
                if (!!state.popper) {
                    state.popper!.destroy()
                }
            },
            bindEvents: () => {
            },
            unbindEvents: () => {
            },
            getReferenceEl: (): HTMLElement | null => {
                const children = Array.from(refs.$el.children)
                if (children[0] !== refs.popper) {
                    return children[0] as HTMLElement
                } else if (!!props.reference) {
                    if (typeof props.reference === 'function') {
                        // @ts-ignore
                        const reference = props.reference()
                        return (reference.$el || reference) as HTMLElement
                    } else {
                        return ((props.reference as any).$el || props.reference) as HTMLElement
                    }
                } else {
                    /*没有reference，等待reference初始化在初始化popper*/
                    return null
                }
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            clickReference: (e: Event) => {
                methods.toggle()
            },
            clickPopperContent: (e: Event) => {
            },
            clickBody: (e: Event) => {
            },
            beforeEnter: () => {
            },
            afterEnter: () => {
            },
            afterLeave: () => {
            },
        }

        /*---------------------------------------watch-------------------------------------------*/
        watch(() => props.value, (val) => {
        })
        watch(() => model.value, (val) => {
        })
        watch(() => openModel.value, (val) => {
        })
        watch(() => props.placement, (val) => {
            if (!!state.popper) {
                state.popper.setPlacement(val as PlainPlacementType)
            }
        })
        watch(() => props.reference, () => {
        })
        watch(() => props.arrow, () => {
        })
        watch(() => props.trigger, () => {
        })

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(async () => {
            await utils.init()
            if (model.value) {
                methods.show()
            }
        })

        onBeforeUnmount(() => {
            utils.destroy()
        })

        return () => (
            <div class={classes.value}
            >
                {slots.default()}
                {!!state.init && (
                    <div ref="popper"
                         class={popperClasses.value}
                         style={popperStyles.value}
                    >
                        <div class="plain-popper-content"
                             ref="content"
                             style={contentStyles.value}
                        >
                            <div class="plain-popper-arrow"/>
                            {slots.popper()}
                        </div>
                    </div>
                )}
            </div>
        )
    },
})