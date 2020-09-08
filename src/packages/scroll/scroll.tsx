import {computed, defineComponent, inject, onBeforeUnmount, onMounted, provide, reactive, SetupContext} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {ElRef, useRefs} from "@/use/useRefs";
import {useRefer} from "@/use/useRefer";

import {ResizeDetectorDirective} from "@/util/ResizeDetector";
import {PLAIN_POPPER_PROVIDER} from "@/packages/popper/popper";
import {$plain} from "@/packages/base";
import {ResizeDetectFuncParam, StyleType} from "@/types/utils";
import {useMounted} from "@/use/useMounted";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useScopedSlots} from "@/use/useScopedSlots";

export const enum PLAIN_SCROLL_VERTICAL_POSITION {
    top = 'top',
    center = 'center',
    bottom = 'bottom'
}

const Props = {
    scrollbarSize: {type: Number},                                                                  // 滚动条大小
    scrollbarColor: {type: String, default: 'rgba(144,147,153,.3)'},                                // 滚动条颜色
    scrollX: {type: Boolean},                                                                       // 可以横向滚动
    scrollY: {type: Boolean, default: true},                                                        // 可以纵向滚动
    hideScrollbar: {type: Boolean},                                                                 // 隐藏滚动条
    alwaysShowScrollbar: {type: Boolean},                                                           // 一直显示滚动条
    fitContentWidth: {type: Boolean},                                                               // 适配内容宽度
    fitContentHeight: {type: Boolean},                                                              // 适配内容高度
    fitHostWidth: {type: Boolean},                                                                  // 适配容器宽度
    fitHostHeight: {type: Boolean},                                                                 // 适配容器高度
    topThreshold: {type: Number, default: 20},                                                      // 距离顶部多少距离派发滚动到顶部事件
    bottomThreshold: {type: Number, default: 20},                                                   // 距离底部多少距离派发滚动到底部事件
}

function scrollSetup(props: ExtractPropTypes<typeof Props>, context: SetupContext) {

    const {slots} = useSlots({
        content: SlotFunc,
    })
    const {scopedSlots} = useScopedSlots({
        'horizontal-scrollbar': {style: {} as StyleType, onMousedown: (e: MouseEvent) => {}},
        'vertical-scrollbar': {style: {} as StyleType, onMousedown: (e: MouseEvent) => {}},
    })

    const {emit, on, off} = useEvent({
        scroll: EmitFunc,
        verticalScrollTop: EmitFunc,
        verticalScrollBottom: EmitFunc,
        verticalScrollCenter: EmitFunc,
    })

    /*---------------------------------------ref-------------------------------------------*/

    const refs = useRefs({
        host: ElRef,
        wrapper: ElRef,
        content: ElRef,
    })

    /*---------------------------------------state-------------------------------------------*/

    const mounted = useMounted()

    const popperProvider = inject<any>(PLAIN_POPPER_PROVIDER, null)

    const state = reactive({
        verticalPosition: PLAIN_SCROLL_VERTICAL_POSITION.top,
        wrapperScrollTop: 0,
        wrapperScrollLeft: 0,

        dragTop: 0,
        dragY: 0,
        dragLeft: 0,
        dragX: 0,

        contentWidth: 0,
        contentHeight: 0,
        hostWidth: 0,
        hostHeight: 0,
        hover: false,
        draging: false,

        cancelAnimate: null as null | number,
    })

    /*---------------------------------------computed-------------------------------------------*/

    const targetScrollbarSize = computed(() => {
        if (!props.scrollX) {
            return props.scrollbarSize || 6
        } else {
            return props.scrollbarSize || 9
        }
    })

    const classes = computed(() => [
        `pl-scroll`,
        {
            'pl-scroll-draging': state.draging,
            // 'pl-scroll-disabled': props.disableScroll,
            'pl-scroll-always-show-scroll-bar': props.alwaysShowScrollbar,
        }
    ])

    const hostStyles = computed(() => {
        if (!mounted.value) return null
        const style: StyleType = {}
        if (props.fitContentHeight) {
            style.height = `${state.contentHeight}px`
        }
        return style
    })

    const wrapperStyles = computed(() => {
        if (!mounted.value) return null
        const style: StyleType = {}
        if (props.fitContentHeight) {
            style.height = `${state.contentHeight + 17}px`
        }
        return style
    })

    const contentStyles = computed(() => {
        if (!mounted.value) return null
        const styles: StyleType = {}

        if (!props.scrollX) {
            styles.width = props.fitContentWidth && state.contentWidth > 0 ? `${state.contentWidth}px` : `100%`;
            styles.overflowX = 'hidden'
        }

        if (!props.scrollY) {
            styles.height = props.fitContentHeight && state.contentHeight > 0 ? `${state.contentHeight}px` : `100%`;
            styles.overflowY = 'hidden'
        }

        if (props.fitHostHeight) {
            styles.height = '100%'
        }
        if (props.fitHostWidth) {
            styles.width = '100%'
        }
        if (props.fitContentWidth) {
            styles.width = `${state.contentWidth}px`
        }
        if (props.fitContentHeight) {
            styles.height = `${state.contentHeight}px`
        }

        return styles
    })

    const verticalScrollbarHeight = computed(() => {
        return state.contentHeight > state.hostHeight ? (state.hostHeight * state.hostHeight / state.contentHeight) : 0
    })

    const verticalScrollbarTop = computed(() => {
        return (state.hostHeight - verticalScrollbarHeight.value) * state.wrapperScrollTop / (state.contentHeight - state.hostHeight)
    })

    const horizontalScrollbarWidth = computed(() => {
        return state.contentWidth > state.hostWidth ? (state.hostWidth * state.hostWidth) / state.contentWidth : 0
    })

    const horizontalScrollbarLeft = computed(() => {
        return (state.hostWidth - horizontalScrollbarWidth.value) * state.wrapperScrollLeft / (state.contentWidth - state.hostWidth)
    })

    const horizontalScrollbarStyles = computed(() => {
        return {
            height: `${targetScrollbarSize.value}px`,
            width: `${horizontalScrollbarWidth.value}px`,
            left: `${horizontalScrollbarLeft.value}px`,
            backgroundColor: props.scrollbarColor,
        } as StyleType
    })

    const verticalScrollbarStyles = computed(() => {
        return {
            height: `${verticalScrollbarHeight.value}px`,
            width: `${targetScrollbarSize.value}px`,
            top: `${verticalScrollbarTop.value}px`,
            backgroundColor: props.scrollbarColor,
        } as StyleType
    })


    /*---------------------------------------methods-------------------------------------------*/


    const methods = {
        refresh: async () => {
            await $plain.nextTick()

            const {scrollWidth: width1, scrollHeight: height1} = refs.content
            handler.contentResize({
                width: Math.ceil(width1),
                height: Math.ceil(height1),
            })

            const {scrollWidth: width2, scrollHeight: height2} = refs.host
            handler.hostResize({
                width: Math.ceil(width2),
                height: Math.ceil(height2),
            })
        },
        scroll(point: { x?: number, y?: number }, time?: number) {
            if (!refs.wrapper) return

            // if (point.x != null) this.wrapper!.scrollLeft = point.x
            // if (point.y != null) this.wrapper!.scrollTop = point.y
            if (!time) {
                if (point.x != null) refs.wrapper!.scrollLeft = point.x
                if (point.y != null) refs.wrapper!.scrollTop = point.y
            } else {

                if (!!state.cancelAnimate) {
                    cancelAnimationFrame(state.cancelAnimate)
                    state.cancelAnimate = null
                }

                let ny = refs.wrapper!.scrollTop
                let nx = refs.wrapper!.scrollLeft

                let ky = (point.y! - ny) / time
                let kx = (point.x! - nx) / time

                let startTime = Date.now()
                const run = () => {
                    let nowTime = Date.now()
                    let delta = nowTime - startTime
                    let top;
                    let left;

                    if (delta >= time) {
                        state.cancelAnimate = null
                        top = time * ky + ny
                        left = time * kx + nx

                        if (!!refs.wrapper) {
                            refs.wrapper.scrollTop = top
                            refs.wrapper.scrollLeft = left
                        }
                    } else {
                        top = delta * ky + ny
                        left = delta * kx + nx

                        if (!!refs.wrapper) {
                            refs.wrapper.scrollTop = top
                            refs.wrapper.scrollLeft = left
                        }
                        state.cancelAnimate = requestAnimationFrame(run)
                    }
                }
                run()
            }
        },
        scrollTop(scrollTop: number, time?: number) {
            methods.scroll({y: scrollTop}, time)
        },
        scrollLeft(scrollLeft: number, time?: number) {
            methods.scroll({x: scrollLeft}, time)
        },
        scrollEnd(point: { x: boolean, y?: boolean } = {x: true, y: true}) {
            if (!!point.x) refs.wrapper!.scrollLeft = refs.wrapper!.scrollWidth
            if (!!point.y) refs.wrapper!.scrollTop = refs.wrapper!.scrollHeight
        },
        autoScrollTop() {
            const {wrapperScrollTop, hostHeight, contentHeight} = state
            const scrollHeight = contentHeight - hostHeight
            if (scrollHeight <= 0) {
                return
            }
            const height = wrapperScrollTop
            if (height <= 0) {
                return
            }
            const duration = (height / 200) * 1000
            methods.scrollTop(0, duration)
        },
        autoScrollBottom() {
            const {wrapperScrollTop, hostHeight, contentHeight} = state
            const scrollHeight = contentHeight - hostHeight
            if (scrollHeight <= 0) {
                return
            }
            const height = scrollHeight - wrapperScrollTop
            if (height <= 0) {
                return
            }
            const duration = (height / 200) * 1000
            methods.scrollTop(scrollHeight, duration)
        },
        autoScrollLeft() {
            const {wrapperScrollLeft, hostWidth, contentWidth} = state
            const scrollWidth = contentWidth - hostWidth
            if (scrollWidth <= 0) {
                return
            }
            const width = wrapperScrollLeft
            if (width <= 0) {
                return
            }
            const duration = (width / 200) * 1000
            methods.scrollLeft(0, duration)
        },
        autoScrollRight() {
            const {wrapperScrollLeft, hostWidth, contentWidth} = state
            const scrollWidth = contentWidth - hostWidth
            if (scrollWidth <= 0) {
                return
            }
            const width = scrollWidth - wrapperScrollLeft
            if (width <= 0) {
                return
            }
            const duration = (width / 200) * 1000
            methods.scrollLeft(scrollWidth, duration)
        },
        stopAutoScroll() {
            if (!!state.cancelAnimate) {
                cancelAnimationFrame(state.cancelAnimate)
                state.cancelAnimate = null
            }
        },
    }


    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        windowResize: $plain.utils.throttle(() => methods.refresh(), 500),
        popperOpen: () => {
            methods.refresh()
        },
        popperShow: () => {
            $plain.nextTick(() => methods.scroll({y: 0}))
        },
        contentResize: (data: ResizeDetectFuncParam) => {
            if (data.width != null) state.contentWidth = data.width
            if (data.height != null) state.contentHeight = data.height
        },
        hostResize: (data: ResizeDetectFuncParam) => {
            if (data.width != null) state.hostWidth = data.width - 16
            if (data.height != null) state.hostHeight = data.height - 16
        },
        wrapperMousewheel: (e: MouseWheelEvent) => {
            if (!!state.cancelAnimate) {
                cancelAnimationFrame(state.cancelAnimate)
                state.cancelAnimate = null
            }
        },
        wrapperScroll: (e: MouseEvent) => {
            const target = e.target as HTMLElement
            state.wrapperScrollTop = target.scrollTop
            state.wrapperScrollLeft = target.scrollLeft

            emit.scroll(e)

            if (state.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.top && state.wrapperScrollTop > props.topThreshold!) {
                /*进入center*/
                emit.verticalScrollCenter(e)
                state.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.center
            } else if (state.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.center) {
                // console.log(this.contentHeight - this.hostHeight - this.contentWrapperScrollTop, this.bottomScrollDuration)
                if (state.wrapperScrollTop < props.topThreshold!) {
                    /*进入top*/
                    emit.verticalScrollTop(e)
                    state.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.top
                } else if (state.contentHeight - state.hostHeight - state.wrapperScrollTop < props.bottomThreshold!) {
                    /*进入bottom*/
                    emit.verticalScrollBottom(e)
                    state.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.bottom
                }

            } else if (state.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.bottom) {
                if (state.contentHeight - state.hostHeight - state.wrapperScrollTop > props.bottomThreshold!) {
                    /*进入center*/
                    emit.verticalScrollCenter(e)
                    state.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.center
                }
            }
        },
        vertical: {
            dragstart: (e: MouseEvent) => {
                state.draging = true
                state.dragTop = verticalScrollbarTop.value
                state.dragY = e.clientY
                document.addEventListener('mousemove', handler.vertical.dragmove)
                document.addEventListener('mouseup', handler.vertical.dragend)
                $plain.disableSelect()
            },
            dragmove: (e: MouseEvent) => {
                let deltaY = e.clientY - state.dragY
                let top = state.dragTop + deltaY
                refs.wrapper.scrollTop = top * (state.contentHeight - state.hostHeight) / (state.hostHeight - verticalScrollbarHeight.value)
            },
            dragend: () => {
                state.draging = false
                document.removeEventListener('mousemove', handler.vertical.dragmove)
                document.removeEventListener('mouseup', handler.vertical.dragend)
                $plain.enableSelect()
            }
        },
        horizontal: {
            dragstart: (e: MouseEvent) => {
                state.draging = true
                state.dragLeft = horizontalScrollbarLeft.value
                state.dragX = e.clientX
                document.addEventListener('mousemove', handler.horizontal.dragmove)
                document.addEventListener('mouseup', handler.horizontal.dragend)
                $plain.disableSelect()
            },
            dragmove: (e: MouseEvent) => {
                let deltaX = e.clientX - state.dragX
                const left = state.dragLeft + deltaX
                refs.wrapper.scrollLeft = left * (state.contentWidth - state.hostWidth) / (state.hostWidth - horizontalScrollbarWidth.value)
            },
            dragend: () => {
                state.draging = false
                document.removeEventListener('mousemove', handler.horizontal.dragmove)
                document.removeEventListener('mouseup', handler.horizontal.dragend)
                $plain.enableSelect()
            },
        },
    }

    const refer = {
        refs,
        on, off,
        slots,
        scopedSlots,

        classes,
        handler,
        hostStyles,
        contentStyles,
        wrapperStyles,
        verticalScrollbarStyles,
        horizontalScrollbarStyles,

        methods,
        state,
    }

    useRefer(refer)

    provide(SCROLL_PROVIDER, refer)

    /*---------------------------------------lifecycle-------------------------------------------*/

    onMounted(() => {
        window.addEventListener('resize', handler.windowResize)
        if (!!popperProvider) {
            popperProvider.on.open(handler.popperOpen)
            popperProvider.on.show(handler.popperShow)
        }
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handler.windowResize)
        if (!!popperProvider) {
            popperProvider.off.open(handler.popperOpen)
            popperProvider.off.show(handler.popperShow)
        }
    })

    return refer
}

type ScrollType = ReturnType<typeof scrollSetup>

export type PlainScroll = {
    methods: ScrollType["methods"],
    state: ScrollType["state"],
    on: ScrollType["on"],
    off: ScrollType["off"],
    refs: ScrollType["refs"],
}

const SCROLL_PROVIDER = '@@SCROLL_PROVIDER'

export const injectScroll = () => inject(SCROLL_PROVIDER) as PlainScroll

export default defineComponent({
    name: 'pl-scroll',
    props: {
        ...Props,
    },
    directives: {resize: ResizeDetectorDirective},
    setup(props, context) {

        const {
            slots,
            scopedSlots,
            classes,
            handler,
            hostStyles,
            contentStyles,
            wrapperStyles,
            verticalScrollbarStyles,
            horizontalScrollbarStyles,
        } = scrollSetup(props, context)
        return () => (
            <div ref="host"
                 class={classes.value}
                 {...{directives: [{name: 'resize', value: handler.hostResize}]}}
                 style={hostStyles.value}>
                <div ref="wrapper"
                     class="pl-scroll-wrapper"
                     style={wrapperStyles.value}
                     onScroll={handler.wrapperScroll}
                     onMousewheel={handler.wrapperMousewheel}>
                    <div ref="content"
                         class="pl-scroll-content"
                         style={contentStyles.value}
                         {...{directives: [{name: 'resize', value: handler.contentResize}]}}
                    >
                        {slots.default()}
                    </div>
                    {slots.content()}
                </div>

                {
                    !props.hideScrollbar && props.scrollY && (
                        <div class="pl-vertical-scrollbar-wrapper">
                            {
                                scopedSlots["vertical-scrollbar"]({
                                    param: {style: verticalScrollbarStyles.value, onMousedown: handler.vertical.dragstart},
                                    content: (
                                        <div class="pl-vertical-scrollbar"
                                             style={verticalScrollbarStyles.value}
                                             onMousedown={handler.vertical.dragstart}>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                {
                    !props.hideScrollbar && props.scrollX && (
                        <div class="pl-horizontal-scrollbar-wrapper">
                            {
                                scopedSlots["horizontal-scrollbar"]({
                                    param: {style: horizontalScrollbarStyles.value, onMousedown: handler.horizontal.dragstart},
                                    content: (
                                        <div class="pl-horizontal-scrollbar"
                                             style={horizontalScrollbarStyles.value}
                                             onMousedown={handler.horizontal.dragstart}>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        )
    },
})