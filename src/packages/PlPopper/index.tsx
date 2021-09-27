import './popper.scss'
import {createError} from "../../utils/createError";
import {useClasses, SimpleFunction, computed, designComponent, getCurrentInstance, markRaw, onBeforeUnmount, onMounted, PropType, reactive, useModel, useNumber, useRefs, useStyles, watch, nextIndex} from "plain-ui-composition";
import {getPopperTrigger, PopperTrigger, PopperTriggerType} from "./trigger/PopperTrigger";
import {getElement} from "../../utils/getElement";
import {delay} from "plain-utils/utils/delay";
import {debounce} from "plain-utils/utils/debounce";
import {PlScroll} from "../PlScroll";
import {PlainPopper} from 'plain-popper'
import {refreshPopperReference} from './refershPopperReference';
import {ClickBodyListener} from "../../utils/ClickBodyListener";
import {createCommentVNode, Teleport} from 'vue'

const error = createError('pl-popper')

export const PlPopper = designComponent({
    name: 'pl-popper',
    props: {
        modelValue: {type: Boolean},                                // 双向绑定值，当前是否打开
        open: {type: Boolean},                                      // 双向绑定值，当前是否已经打开
        trigger: {type: String, default: 'hover'},                  // 触发动作， hover,click,focus,manual,always

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

        reference: {type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)>},// 目标dom元素
        placement: {type: String, default: 'bottom-start'},         // 位置
        arrow: {type: Boolean, default: true},                      // 是否需要箭头

        boundary: {default: document.body as any},                  // 边界元素
        sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
        scrollAttrs: {type: Object},                                // pl-scroll 属性配置
        popperAttrs: {type: Object},                                // 给popper dom节点传递的属性
        title: {type: String},                                      // 标题
    },
    inheritPropsType: HTMLDivElement,
    inheritAttrs: false,
    emits: {
        onUpdateModelValue: (val?: boolean) => true,
        onUpdateOpen: (val?: boolean) => true,
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
        onReferenceBlur: (e: FocusEvent) => true,
    },
    slots: [
        'popper',
        'head',
        'default',
    ],
    setup({props, slots, event, attrs}) {

        const {emit, on, off} = event

        const {refs, onRef} = useRefs({
            comment: HTMLElement,                                               // 注释节点，用来查找reference的第一个节点
            popper: HTMLDivElement,                                             // popper div 节点
            content: HTMLDivElement,                                            // popper content 节点
        });

        /*---------------------------------------state-------------------------------------------*/

        const {numberState} = useNumber(props, [
            'hoverOpenDelay',
            'hoverCloseDelay',
            'offset',
            'width',
            'height',
        ])

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
        }) as {
            el: {
                popper: null | HTMLElement,
                comment: null | HTMLElement,
                reference: null | HTMLElement,
            },
            referenceEl: null | HTMLElement,
            zIndex: number,
            onTransitionend: null | ((e: Event) => void),
            init: boolean,
            popper: null | PlainPopper,
            trigger: null | PopperTrigger,
        }

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

        const popperClasses = useClasses(() => [
            'pl-popper',
            'plain-popper',
            props.transition,
            props.popperClass as any,
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
            numberState.height != null && (styles.height = `${numberState.height}px`);
            numberState.width != null && (styles.width = `${numberState.width}px`);
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
            if (!numberState.height) {
                return null
            } else {
                return Object.assign({
                    fitHostWidth: true,
                }, props.scrollAttrs)
            }
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onPopperContentTransitionend: (e: TransitionEvent) => !!state.onTransitionend && state.onTransitionend(e),
            onClickReference: (e: MouseEvent) => {
                emit.onClickReference(e)
            },
            /*在 contextmenu 中点击 popper的内容的时候，禁止contextmenu被关闭*/
            onMouseupPopper: (e: MouseEvent) => {
                ClickBodyListener.disable()
                setTimeout(() => ClickBodyListener.enable())
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

                    hoverOpenDelay: numberState.hoverOpenDelay as number,
                    hoverCloseDelay: numberState.hoverCloseDelay as number,

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
                ClickBodyListener.listen(handler.onClickBody)
            },
            unbindEvents: () => {
                if (!!state.referenceEl) {
                    state.referenceEl.removeEventListener('click', handler.onClickReference)
                }
                ClickBodyListener.eject(handler.onClickBody)
            },
            initPopper: () => {
                state.popper = new PlainPopper({
                    popper: refs.popper!,
                    reference: state.referenceEl!,
                    padding: 50,
                    placement: props.placement as any,
                    offset: Number(props.offset || (!!props.arrow ? 0 : 2)),
                    boundary: props.boundary as any,
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
                    await delay()
                    await utils.initPopper()
                }
                state.popper!.refresh()

                /*这里要有一定的延迟，否则popper的属性 direction以及align更新没有结束，导致动画的方向不对*/
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
                await delay()
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
            await delay()
            // todo
            /*if (ctx.isDestroyed) {
                return
            }*/
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
                refs,
                event,
                state,
                ...methods,
            },
            render: () => {

                let children = slots.default() as any
                if (!!children) {
                    if (Array.isArray(children)) {
                        if (children.length > 1) {
                            error('allows only one child node!')
                        }
                        children = children[0]
                    }
                }
                return (
                    <>
                        {/*如果没有reference，则不渲染comment节点*/}
                        {!!children && <>
                            <Comment ref={onRef.comment}/>
                            {children}
                        </>}

                        {state.init && <Teleport to=".pl-root-service-container">
                            <div class={popperClasses.value}
                                 style={popperStyles.value}
                                 {...attrs}
                                 {...(props.popperAttrs || {})}
                                 ref={onRef.popper}>
                                <div class="plain-popper-content"
                                     ref={onRef.content}

                                     onClick={emit.onClickPopper}
                                     onTransitionend={handler.onPopperContentTransitionend}
                                     onMousedown={emit.onMousedownPopper}
                                     onMouseup={handler.onMouseupPopper}
                                     {...(props.trigger === 'hover' ? {
                                         onMouseenter: e => emit.onEnterPopper(e),
                                         onMouseleave: e => emit.onLeavePopper(e),
                                     } : {})}
                                >
                                    <div class="plain-popper-arrow"/>
                                    {(slots.head.isExist() || props.title) && <div class="pl-popper-title">
                                        {slots.head(props.title)}
                                    </div>}
                                    {(props.message || slots.popper.isExist()) && <div class="pl-popper-content-inner" style={sizeStyles.value}>
                                        {!!scrollAttrs.value ? (
                                            <PlScroll {...scrollAttrs.value}>
                                                {props.message || slots.popper()}
                                            </PlScroll>
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
})

export default PlPopper
