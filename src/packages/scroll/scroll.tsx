import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useRefs} from "../../use/useRefs";
import {StyleProperties} from "../../shims";
import {useMounted} from "../../use/useMounted";
import {reactive, computed, nextTick, onBeforeUnmount, onMounted} from 'vue';
import {throttle} from 'plain-utils/utils/throttle';
import {ResizeDetectFuncParam, ResizeDetectorDirective} from "../../plugins/ResizeDetector";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import Popper from '../popper'
import './scroll.scss'

export const enum PLAIN_SCROLL_VERTICAL_POSITION {
    top = 'top',
    center = 'center',
    bottom = 'bottom'
}

export default designComponent({
    name: 'pl-scroll',
    directives: {resize: ResizeDetectorDirective},
    props: {
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
        autoScrollSpeed: {type: Number, default: 400},                                                  // 自动滚动的时候的速度，每秒钟滚动的距离
        scrollAfterDragEnd: {type: Boolean,},                                                           // 是否拖拽结束后才刷新滚动位置
    },
    emits: {
        scroll: (e: Event) => true,
        verticalScrollTop: (e: Event) => true,
        verticalScrollBottom: (e: Event) => true,
        verticalScrollCenter: (e: Event) => true,
    },
    setup({props, event: {emit, on, off}}) {
        const {slots} = useSlots(['content'])
        const {scopedSlots} = useScopedSlots({
            'horizontal-scrollbar': {style: {} as StyleProperties, onMousedown: (e: MouseEvent) => {/*do nothing*/}},
            'vertical-scrollbar': {style: {} as StyleProperties, onMousedown: (e: MouseEvent) => {/*do nothing*/}},
        })

        /*---------------------------------------ref-------------------------------------------*/

        const {refs} = useRefs({
            host: HTMLDivElement,
            wrapper: HTMLDivElement,
            content: HTMLDivElement,
        })

        /*---------------------------------------state-------------------------------------------*/

        const mounted = useMounted()

        const popper = Popper.use.inject(null)

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
            const style: StyleProperties = {}
            if (props.fitContentHeight) {
                style.height = `${state.contentHeight}px`
            }
            return style
        })

        const wrapperStyles = computed(() => {
            if (!mounted.value) return null
            const style: StyleProperties = {}
            if (props.fitContentHeight) {
                style.height = `${state.contentHeight + 17}px`
            }
            return style
        })

        const contentStyles = computed(() => {
            if (!mounted.value) return null
            const styles: StyleProperties = {}

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
            } as StyleProperties
        })

        const verticalScrollbarStyles = computed(() => {
            return {
                height: `${verticalScrollbarHeight.value}px`,
                width: `${targetScrollbarSize.value}px`,
                top: `${verticalScrollbarTop.value}px`,
                backgroundColor: props.scrollbarColor,
            } as StyleProperties
        })


        /*---------------------------------------methods-------------------------------------------*/


        const methods = {
            refresh: async () => {
                await nextTick()

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
                const duration = (height / props.autoScrollSpeed) * 1000
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
                const duration = (height / props.autoScrollSpeed) * 1000
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
                const duration = (width / props.autoScrollSpeed) * 1000
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
                const duration = (width / props.autoScrollSpeed) * 1000
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
            windowResize: throttle(() => methods.refresh(), 500),
            popperOpen: () => methods.refresh(),
            popperShow: async () => {
                await nextTick()
                methods.scroll({y: 0})
            },
            contentResize: (data: ResizeDetectFuncParam) => {
                if (data.width != null) state.contentWidth = data.width
                if (data.height != null) state.contentHeight = data.height
            },
            hostResize: (data: ResizeDetectFuncParam) => {
                if (data.width != null) state.hostWidth = data.width - 16
                if (data.height != null) state.hostHeight = data.height - 16
            },
            wrapperMousewheel: (e: WheelEvent) => {
                if (!!state.cancelAnimate) {
                    cancelAnimationFrame(state.cancelAnimate)
                    state.cancelAnimate = null
                }
            },
            wrapperScroll: (e: Event) => {
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
                    disabledUserSelect()
                },
                dragmove: (e: MouseEvent) => {
                    let deltaY = e.clientY - state.dragY
                    let top = state.dragTop + deltaY
                    let scrollTop = top * (state.contentHeight - state.hostHeight) / (state.hostHeight - verticalScrollbarHeight.value)
                    scrollTop = Math.max(0, Math.min(scrollTop, state.contentHeight - state.hostHeight))
                    if (!props.scrollAfterDragEnd) {
                        refs.wrapper.scrollTop = scrollTop
                    } else {
                        state.wrapperScrollTop = scrollTop
                    }
                },
                dragend: (e: MouseEvent) => {
                    state.draging = false
                    document.removeEventListener('mousemove', handler.vertical.dragmove)
                    document.removeEventListener('mouseup', handler.vertical.dragend)
                    enableUserSelect()

                    if (props.scrollAfterDragEnd) {
                        let deltaY = e.clientY - state.dragY
                        let top = state.dragTop + deltaY
                        refs.wrapper.scrollTop = top * (state.contentHeight - state.hostHeight) / (state.hostHeight - verticalScrollbarHeight.value)
                    }
                }
            },
            horizontal: {
                dragstart: (e: MouseEvent) => {
                    state.draging = true
                    state.dragLeft = horizontalScrollbarLeft.value
                    state.dragX = e.clientX
                    document.addEventListener('mousemove', handler.horizontal.dragmove)
                    document.addEventListener('mouseup', handler.horizontal.dragend)
                    disabledUserSelect()
                },
                dragmove: (e: MouseEvent) => {
                    let deltaX = e.clientX - state.dragX
                    const left = state.dragLeft + deltaX
                    let scrollLeft = left * (state.contentWidth - state.hostWidth) / (state.hostWidth - horizontalScrollbarWidth.value)
                    scrollLeft = Math.max(0, Math.min(scrollLeft, state.contentWidth - state.hostWidth))
                    if (!props.scrollAfterDragEnd) {
                        refs.wrapper.scrollLeft = scrollLeft
                    } else {
                        state.wrapperScrollLeft = scrollLeft
                    }
                },
                dragend: (e: MouseEvent) => {
                    state.draging = false
                    document.removeEventListener('mousemove', handler.horizontal.dragmove)
                    document.removeEventListener('mouseup', handler.horizontal.dragend)
                    enableUserSelect()

                    if (props.scrollAfterDragEnd) {
                        let deltaX = e.clientX - state.dragX
                        const left = state.dragLeft + deltaX
                        refs.wrapper.scrollLeft = left * (state.contentWidth - state.hostWidth) / (state.hostWidth - horizontalScrollbarWidth.value)
                    }
                },
            },
        }

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            window.addEventListener('resize', handler.windowResize)
            if (!!popper) {
                popper.event.on.open(handler.popperOpen)
                popper.event.on.show(handler.popperShow)
            }
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', handler.windowResize)
            if (!!popper) {
                popper.event.off.open(handler.popperOpen)
                popper.event.off.show(handler.popperShow)
            }
        })

        return {
            refer: {
                refs,
                on, off,
                slots,
                scopedSlots,
                handler,
                methods,
                state,
            },
            render: () => (
                <div ref="host"
                     class={classes.value}
                     v-resize={handler.hostResize}
                     style={hostStyles.value as any}>
                    <div ref="wrapper"
                         class="pl-scroll-wrapper"
                         style={wrapperStyles.value as any}
                         onScroll={handler.wrapperScroll}
                         {...{onMousewheel: handler.wrapperMousewheel}}>
                        <div ref="content"
                             class="pl-scroll-content"
                             style={contentStyles.value as any}
                             v-resize={handler.contentResize}>
                            {slots.default()}
                        </div>
                        {slots.content()}
                    </div>

                    {
                        !props.hideScrollbar && props.scrollY && (
                            <div class="pl-vertical-scrollbar-wrapper">
                                {
                                    scopedSlots["vertical-scrollbar"](
                                        {style: verticalScrollbarStyles.value as any, onMousedown: handler.vertical.dragstart},
                                        (
                                            <div class="pl-vertical-scrollbar"
                                                 style={verticalScrollbarStyles.value as any}
                                                 onMousedown={handler.vertical.dragstart}>
                                            </div>
                                        ))
                                }
                            </div>
                        )
                    }
                    {
                        !props.hideScrollbar && props.scrollX && (
                            <div class="pl-horizontal-scrollbar-wrapper">
                                {
                                    scopedSlots["horizontal-scrollbar"](
                                        {style: horizontalScrollbarStyles.value as any, onMousedown: handler.horizontal.dragstart},
                                        (
                                            <div class="pl-horizontal-scrollbar"
                                                 style={horizontalScrollbarStyles.value as any}
                                                 onMousedown={handler.horizontal.dragstart}>
                                            </div>
                                        ))
                                }
                            </div>
                        )
                    }
                </div>
            )
        }
    },
})