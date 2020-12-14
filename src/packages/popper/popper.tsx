import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {computed, onMounted, createCommentVNode, Teleport, reactive, markRaw, nextTick, watch, getCurrentInstance, onBeforeUnmount} from 'vue';
import {createError} from "../../utils/createError";
import {useRefs} from "../../use/useRefs";
import {getElement} from "../../utils/getElement";
import {useModel} from "../../use/useModel";
import {nextIndex} from "../../utils/nextIndex";
import {PlainPopper} from 'plain-popper'
import {SimpleFunction} from "../../shims";
import {getPopperTrigger, PopperTrigger, PopperTriggerType} from "./trigger/PopperTrigger";
import {useProps} from "../../use/useProps";
import {useStyles} from "../../use/useStyles";
import {debounce} from "plain-utils/utils/debounce";
import './popper.scss'
import {refreshPopperReference} from "./refershPopperReference";
import {delay} from "plain-utils/utils/delay";

const error = createError('pl-popper')

export default designComponent({
    name: 'pl-popper',
    props: {
        modelValue: {type: Boolean},                                // 双向绑定值，当前是否打开
        open: {type: Boolean},                                      // 双向绑定值，当前是否已经打开
        trigger: {type: String, default: 'hover'},                  // 触发动作， hover,click,focus,manual,always

        title: {type: String},                                      // 标题文本
        message: {type: String},                                    // 内容文本
        disabled: {type: Boolean},                                  // 禁用
        transition: {type: String, default: 'pl-transition-fade'},  // 动画名称：pl-transition-fade, pl-transition-scale, pl-transition-scale-y, pl-transition-popper-drop
        popperClass: {type: [String, Array, Object]},               // popper容器节点样式
        offset: {type: [Number, String]},                           // 偏移量
        width: {type: [Number, String]},                            // 宽度
        height: {type: [Number, String]},                           // 高度
        hoverOpenDelay: {type: [Number, String], default: 0},       // hover触发条件下，打开延迟时间
        hoverCloseDelay: {type: [Number, String], default: 200},    // hover触发条件下，关闭延迟时间
        noContentPadding: {type: Boolean},                          // 去掉默认内容内边距

        reference: {type: [Function, Element]},                     // 目标dom元素
        placement: {type: String, default: 'bottom-start'},         // 位置
        arrow: {type: Boolean, default: true},                      // 是否需要箭头

        boundary: {default: 'window'},                              // 边界元素
        sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
        scrollAttrs: {type: Object},                                // pl-scroll 属性配置
        popperAttrs: {type: Object},                                // 给popper dom节点传递的属性
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true,
        onUpdateOpen: (val: boolean) => true,
        onInit: () => true,
        onDestroy: () => true,
        onOpen: () => true,
        onClose: () => true,
        onShow: () => true,
        onHide: () => true,

        onClickReference: (e: MouseEvent) => true,
        onClickPopper: (e: MouseEvent) => true,
        onClickBody: (e: MouseEvent) => true,
        onMousedownPopper: (e: MouseEvent) => true,

        onEnterReference: (e: MouseEvent) => true,
        onLeaveReference: (e: MouseEvent) => true,
        onEnterPopper: (e: MouseEvent) => true,
        onLeavePopper: (e: MouseEvent) => true,
        onReferenceFocus: (e: FocusEvent) => true,
        onReferenceBlur: (e: Event) => true,
    },
    setup({props, event}) {

        const {emit, on, off} = event

        const {slots} = useSlots([
            'popper',
            'title',
        ], true)

        const {refs} = useRefs({
            comment: HTMLElement,                                               // 注释节点，用来查找reference的第一个节点
            popper: HTMLDivElement,                                             // popper div 节点
            content: HTMLDivElement,                                            // popper content 节点
        });

        /*---------------------------------------state-------------------------------------------*/

        const {propsState} = useProps(props, {
            hoverOpenDelay: useProps.NUMBER,
            hoverCloseDelay: useProps.NUMBER,
            offset: useProps.NUMBER,
            width: useProps.NUMBER,
            height: useProps.NUMBER,
        })

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoEmit: false, autoWatch: false})
        const openModel = useModel(() => props.open, emit.onUpdateOpen, {autoEmit: false, autoWatch: false})

        const state = reactive({
            el: {
                popper: null as null | HTMLElement,                             // popper 节点
                comment: null as null | HTMLElement,                            // comment 节点
                reference: null as null | HTMLElement,                          // comment.nextElementSibling，也就是 reference 的第一个节点
            },
            referenceEl: null as null | HTMLElement,                            // 真正的 reference 对象获取方法
            zIndex: nextIndex(),                                                // popper zIndex值
            onTransitionend: null as null | ((e: Event) => void),               // 当show或者hide，需要监听一次 transitionend事件，所以这里有可能是null
            init: false,                                                        // 当前是否已经初始化popper content及其Popper对象
            popper: null as null | PlainPopper,                                 // PlainPopper 对象
            trigger: null as null | PopperTrigger,                              // 触发类型
        })

        /**
         * 检查默认插槽中是否存在多个节点，如果是则发出警告
         * @author  韦胜健
         * @date    2020/11/17 9:45
         */
        const referenceVNode = computed(() => {
            const slot = slots.default() as any
            if (!slot) {
                return null
            }
            if (slot.length > 1) {
                error('allows only one child node!')
            }
            return slot[0]
        })

        /*---------------------------------------computed-------------------------------------------*/

        /**
         * 当前方向，用来配置sizeEqual使用
         * @author  韦胜健
         * @date    2020/11/17 10:49
         */
        const direction = computed(() => {
            const [direction] = props.placement.split('-')
            return direction as 'top' | 'bottom' | 'left' | 'right'
        })

        const popperClasses = computed(() => [
            'pl-popper',
            'plain-popper',
            props.transition,
            props.popperClass,
            {
                'pl-popper-show': model.value,
                'pl-popper-open': openModel.value,
                // 'pl-popper-ready': state.ready,
                'pl-popper-show-arrow': props.arrow,
                'pl-popper-no-content-padding': props.noContentPadding,
            }
        ])

        const popperStyles = useStyles(style => {
            style.zIndex = state.zIndex
        })

        const sizeStyles = useStyles(styles => {
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

        const scrollAttrs = computed(() => {
            if (!propsState.height) {
                return null
            } else {
                return Object.assign({
                    fitHostWidth: true,
                }, props.scrollAttrs)
            }
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onPopperContentTransitionend: (e: Event) => !!state.onTransitionend && state.onTransitionend(e),
            onClickReference: (e: MouseEvent) => {
                emit.onClickReference(e)
            },
            onClickPopper: (e: MouseEvent) => {
                emit.onClickPopper(e)
            },
            onClickBody: (e: MouseEvent) => {
                if (!model.value && !openModel.value) {
                    return;
                }
                if (state.referenceEl!.contains(e.target as Node)) {
                    /*点击了reference*/
                    return
                }
                if (!!refs.content && refs.content!.contains(e.target as Node)) {
                    /*点击了content*/
                    return
                }
                emit.onClickBody(e)
            },
        }

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            init: (): boolean => {
                let {comment, reference} = state.el
                if (!!comment && !!reference) {
                    state.referenceEl = reference
                } else if (!!props.reference) {
                    state.referenceEl = getElement(typeof props.reference === "function" ? (props.reference as SimpleFunction)() : props.reference)
                } else {
                    /*没有reference，等待reference初始化在初始化popper*/
                    return false
                }
                utils.bindEvents()

                state.trigger = getPopperTrigger(props.trigger as PopperTriggerType, {
                    model,
                    openModel: openModel,
                    show: methods.show,
                    hide: methods.hide,

                    hoverOpenDelay: propsState.hoverOpenDelay as number,
                    hoverCloseDelay: propsState.hoverCloseDelay as number,

                    reference: state.referenceEl as HTMLElement,

                    on,
                    off,
                    emit,
                })

                state.trigger.init()
                emit.onInit()

                return true
            },
            destroy: () => {
                utils.unbindEvents()
                if (!!state.trigger) {
                    state.trigger.destroy()
                }
                if (!!state.popper) {
                    state.popper.destroy()
                }
                emit.onDestroy()
            },
            bindEvents: () => {
                if (!!state.referenceEl) {
                    state.referenceEl.addEventListener('click', handler.onClickReference)
                }
                document.body.addEventListener('click', handler.onClickBody, true)
            },
            unbindEvents: () => {
                if (!!state.referenceEl) {
                    state.referenceEl.removeEventListener('click', handler.onClickReference)
                }
                document.body.removeEventListener('click', handler.onClickBody, true)
            },
            initPopper: () => {
                state.popper = new PlainPopper({
                    popper: refs.popper,
                    reference: state.referenceEl!,
                    padding: 50,
                    placement: props.placement as any,
                    offset: Number(props.offset || (!!props.arrow ? 0 : 2)),
                    boundary: props.boundary,
                    arrowSize: !props.arrow ? 0 : undefined,
                    shouldUpdate: () => !!model.value
                })
            }
        }

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            show: async (shouldEmit = true) => {
                if (props.disabled) {
                    return
                }
                if (!state.init) {
                    state.init = true
                    await nextTick()
                    await utils.initPopper()
                }
                state.popper!.refresh()

                /*这里要有一定的延迟，否则popper的属性 direction以及align更新没有结束，导致动画的方向不对*/
                await nextTick()
                await delay(50)

                state.zIndex = nextIndex()
                model.value = true
                emit.onShow()
                if (shouldEmit) {
                    emit.onUpdateModelValue(model.value)
                }
                state.onTransitionend = () => {
                    openModel.value = true
                    state.onTransitionend = null
                }
            },
            hide: (shouldEmit = true) => {
                model.value = false
                emit.onHide()
                if (shouldEmit) {
                    emit.onUpdateModelValue(model.value)
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
            refreshReference: async () => {
                await nextTick()
                const comment = getElement(refs.comment)
                const reference = !!comment ? comment!.nextElementSibling as HTMLElement : null
                // console.log(reference, state.el.reference)
                if (!!reference && reference !== state.el.reference) {
                    await utils.destroy()
                    state.el.reference = markRaw(reference)
                    await utils.init()
                }
            }
        }

        onMounted(async () => {

            const popper = getElement(refs.popper)
            const comment = getElement(refs.comment)
            const reference = !!comment ? comment!.nextElementSibling as HTMLElement : null
            // console.log({popper, comment, reference})

            state.el = markRaw({popper, comment, reference})

            await utils.init()
            if (model.value) {
                await methods.show(false)
            }
        })

        onBeforeUnmount(() => utils.destroy())
        refreshPopperReference.provide(methods.refreshReference)

        /*---------------------------------------watch-------------------------------------------*/
        watch(() => props.modelValue, (val) => {
            if (val === model.value) {
                return
            }
            if (val) {
                methods.show(false)
            } else {
                methods.hide(false)
            }
        })
        // watch(() => model.value, (val) => {})
        watch(() => openModel.value, (val) => {
            if (!!val) {
                emit.onUpdateOpen(true)
                emit.onOpen()
            } else {
                emit.onUpdateOpen(false)
                emit.onClose()
            }
        })
        watch(() => props.placement, (val) => {
            if (!!state.popper) {
                state.popper.setPlacement(val as any)
            }
        })

        const ctx = getCurrentInstance()!
        const popperConfigChangeHandler = debounce(async () => {
            // console.log('popperConfigChangeHandler')
            await nextTick()
            if (ctx.isUnmounted) {
                return
            }
            await utils.destroy()
            await utils.init()
            if (!state.referenceEl) {
                if (!!state.popper) {
                    state.popper.destroy()
                    state.popper = null
                }
                return
            }
            if (!!state.popper) {
                await utils.initPopper()
            }
        }, 50)
        watch(() => props.reference, popperConfigChangeHandler)
        watch(() => props.arrow, popperConfigChangeHandler)
        watch(() => props.trigger, popperConfigChangeHandler)

        /*---------------------------------------render-------------------------------------------*/

        const Comment = createCommentVNode('') as any

        return {
            refer: {
                event,
                state,
                ...methods,
            },
            render: () => {
                const {value: ReferenceVNode} = referenceVNode
                return (
                    <>
                        {/*如果没有reference，则不渲染comment节点*/}
                        {!!ReferenceVNode && <>
                            <Comment ref="comment"/>
                            <ReferenceVNode/>
                        </>}

                        {state.init && <Teleport to=".pl-root-service-container">
                            <div class={popperClasses.value}
                                 style={popperStyles.value}
                                 {...(props.popperAttrs || {})}
                                 ref="popper">
                                <div class="plain-popper-content"
                                     ref="content"

                                     onClick={emit.onClickPopper}
                                     onTransitionend={handler.onPopperContentTransitionend}
                                     onMousedown={emit.onMousedownPopper}
                                     {...(props.trigger === 'hover' ? {
                                         onMouseenter: emit.onEnterPopper,
                                         onMouseleave: emit.onLeavePopper,
                                     } : {})}
                                >
                                    <div class="plain-popper-arrow"/>
                                    {(props.title || slots.title.isExist()) && <div class="pl-popper-title">
                                        {props.title || slots.title()}
                                    </div>}
                                    {(props.message || slots.popper.isExist()) && <div class="pl-popper-content-inner" style={sizeStyles.value}>
                                        {!!scrollAttrs.value ? (
                                            <pl-scroll {...scrollAttrs.value}>
                                                {props.message || slots.popper()}
                                            </pl-scroll>
                                        ) : (props.message || slots.popper())}
                                    </div>}
                                </div>
                            </div>
                        </Teleport>}
                    </>
                )
            }
        }
    },
}, {
    refreshPopperReference,
})