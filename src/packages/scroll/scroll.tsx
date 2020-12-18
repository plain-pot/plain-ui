import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {useMounted} from "../../use/useMounted";
import {computed, nextTick, onBeforeUnmount, onMounted, reactive, watch} from 'vue';
import {throttle} from 'plain-utils/utils/throttle';
import {ResizeDetectFuncParam, ResizeDetectorDirective} from "../../plugins/ResizeDetector";
import Popper from '../popper'
import './scroll.scss'
import {useStyles} from "../../use/useStyles";
import {VerticalScrollbar} from "./vertical-scrollbar";
import {HorizontalScrollbar} from "./horizontal-scrollbar";
import {delay} from "plain-utils/utils/delay";
import {debounce} from "plain-utils/utils/debounce";

export const enum PLAIN_SCROLL_VERTICAL_POSITION {
    top = 'top',
    center = 'center',
    bottom = 'bottom'
}

const Scroll = designComponent({
    name: 'pl-scroll',
    directives: {resize: ResizeDetectorDirective},
    props: {
        refreshState: {},                                                                               // 监听改属性，以便自动执行refresh刷新
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
        disableListTransition: {type: Boolean,},                                                        // 是否股弄懂的时候禁用pl-list的队列动画
    },
    emits: {
        onScroll: (e: Event) => true,
        onVerticalScrollTop: (e: Event) => true,
        onVerticalScrollBottom: (e: Event) => true,
        onVerticalScrollCenter: (e: Event) => true,
    },
    provideRefer: true,
    setup({props, event: {emit, on, off}}) {

        const {slots} = useSlots(['content'])

        /*---------------------------------------ref-------------------------------------------*/

        const {refs} = useRefs({
            host: HTMLDivElement,
            wrapper: HTMLDivElement,
            content: HTMLDivElement,
        })

        /*---------------------------------------state-------------------------------------------*/

        const mounted = useMounted()
        const popper = Popper.use.inject(null)
        /*非响应式状态*/
        const freezeState = {
            verticalPosition: PLAIN_SCROLL_VERTICAL_POSITION.top,               // 当前滚动纵向位置，top，center，right
            cancelAnimate: null as null | number,                               // 自动滚动动画计时器
            wrapperScrollTop: 0,                                                // 容器 scrollTop
            wrapperScrollLeft: 0,                                               // 容器 scrollLeft
            emitScroll: true,                                                   // 当前是否派发scroll事件

            _isDragging: false,
            get isDragging() {
                return this._isDragging
            },
            set isDragging(val: boolean) {
                this._isDragging = val
                if (val) {
                    refs.host.setAttribute('is-dragging', '')
                } else {
                    refs.host.removeAttribute('is-dragging')
                }
            },
        }
        const state = reactive({
            contentWidth: 0,                                                    // 内容宽度
            contentHeight: 0,                                                   // 内容高度
            hostWidth: 0,                                                       // 容器宽度
            hostHeight: 0,                                                      // 容器高度
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
                'pl-scroll-always-show-scroll-bar': props.alwaysShowScrollbar,
            }
        ])

        const hostStyles = useStyles(style => {
            if (!mounted.value) return style
            if (props.fitContentHeight) {
                style.height = `${state.contentHeight}px`
            }
            return style
        })

        const wrapperStyles = useStyles(style => {
            if (!mounted.value) return style
            if (props.fitContentHeight) {
                style.height = `${state.contentHeight + 17}px`
            }
            return style
        })

        const contentStyles = useStyles(style => {
            if (!mounted.value) return style
            if (!props.scrollX) {
                style.width = props.fitContentWidth && state.contentWidth > 0 ? `${state.contentWidth}px` : `100%`;
                style.overflowX = 'hidden'
            }

            if (!props.scrollY) {
                style.height = props.fitContentHeight && state.contentHeight > 0 ? `${state.contentHeight}px` : `100%`;
                style.overflowY = 'hidden'
            }

            if (props.fitHostHeight) {
                style.height = '100%'
            }
            if (props.fitHostWidth) {
                style.width = '100%'
            }
            if (props.fitContentWidth) {
                style.width = `${state.contentWidth}px`
            }
            if (props.fitContentHeight) {
                style.height = `${state.contentHeight}px`
            }

            return style
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
            /**
             * 滚动到指定位置
             * @author  韦胜健
             * @date    2020/12/7 12:20
             * @param   point
             * @param   point.x             // 滚动scrollLeft值
             * @param   point.y             // 滚动scrollTop值
             * @param   configOrTime        // number|{ time?: number, noEmitScroll?: boolean }
             * @param   configOrTime.time   // 滚动的时间
             * @param   configOrTime.noEmitScroll //滚动期间不派发scroll事件
             */
            async scroll(point: { x?: number, y?: number }, configOrTime?: number | { time?: number, noEmitScroll?: boolean }) {

                if (!refs.wrapper) return

                const config = typeof configOrTime === "number" ? {time: configOrTime} : configOrTime
                const {time, noEmitScroll} = (config || {})

                // if (point.x != null) this.wrapper!.scrollLeft = point.x
                // if (point.y != null) this.wrapper!.scrollTop = point.y

                if (noEmitScroll) {
                    freezeState.emitScroll = false
                }
                const done = () => noEmitScroll && (freezeState.emitScroll = true)

                if (!time) {
                    if (point.x != null) refs.wrapper!.scrollLeft = point.x
                    if (point.y != null) refs.wrapper!.scrollTop = point.y
                    await delay(23)
                    done()
                } else {

                    if (!!freezeState.cancelAnimate) {
                        cancelAnimationFrame(freezeState.cancelAnimate)
                        freezeState.cancelAnimate = null
                    }

                    let ny = refs.wrapper!.scrollTop
                    let nx = refs.wrapper!.scrollLeft

                    let ky = (point.y! - ny) / time
                    let kx = (point.x! - nx) / time

                    let startTime = Date.now()
                    const run = async () => {
                        let nowTime = Date.now()
                        let delta = nowTime - startTime
                        let top;
                        let left;

                        if (delta >= time) {
                            freezeState.cancelAnimate = null
                            top = time * ky + ny
                            left = time * kx + nx

                            if (!!refs.wrapper) {
                                refs.wrapper.scrollTop = top
                                refs.wrapper.scrollLeft = left
                                await delay(23)
                                done()
                            }
                        } else {
                            top = delta * ky + ny
                            left = delta * kx + nx

                            if (!!refs.wrapper) {
                                refs.wrapper.scrollTop = top
                                refs.wrapper.scrollLeft = left
                            }
                            freezeState.cancelAnimate = requestAnimationFrame(run)
                        }
                    }
                    run()
                }
            },
            scrollTop(scrollTop: number, time?: number) {
                methods.scroll({y: scrollTop}, {time})
            },
            scrollLeft(scrollLeft: number, time?: number) {
                methods.scroll({x: scrollLeft}, {time})
            },
            scrollEnd(point: { x: boolean, y?: boolean } = {x: true, y: true}) {
                methods.scroll({
                    x: point.x ? refs.wrapper!.scrollWidth : undefined,
                    y: point.y ? refs.wrapper!.scrollHeight : undefined,
                })
            },
            autoScrollTop() {
                const {hostHeight, contentHeight} = state
                const {wrapperScrollTop} = freezeState
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
                const {hostHeight, contentHeight} = state
                const {wrapperScrollTop} = freezeState
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
                const {hostWidth, contentWidth} = state
                const {wrapperScrollLeft} = freezeState
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
                const {hostWidth, contentWidth} = state
                const {wrapperScrollLeft} = freezeState
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
                if (!!freezeState.cancelAnimate) {
                    cancelAnimationFrame(freezeState.cancelAnimate)
                    freezeState.cancelAnimate = null
                }
            },
            /**
             * 禁用pl-list的队列动画，300ms后恢复正常
             * @author  韦胜健
             * @date    2020/12/15 10:16
             */
            disableListTransition: (() => {
                const disabledQueueAnimation = debounce(() => refs.host.removeAttribute('virtual-scrolling'), 300, true)
                return () => {
                    refs.host.setAttribute('virtual-scrolling', '')
                    disabledQueueAnimation();
                }
            })(),
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
                if (!!freezeState.cancelAnimate) {
                    cancelAnimationFrame(freezeState.cancelAnimate)
                    freezeState.cancelAnimate = null
                }
            },
            wrapperScroll: (e: Event) => {
                const target = e.target as HTMLElement
                freezeState.wrapperScrollTop = target.scrollTop
                freezeState.wrapperScrollLeft = target.scrollLeft

                if (freezeState.emitScroll) {
                    emit.onScroll(e)
                }

                if (freezeState.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.top && freezeState.wrapperScrollTop > props.topThreshold!) {
                    /*进入center*/
                    emit.onVerticalScrollCenter(e)
                    freezeState.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.center
                } else if (freezeState.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.center) {
                    // console.log(this.contentHeight - this.hostHeight - this.contentWrapperScrollTop, this.bottomScrollDuration)
                    if (freezeState.wrapperScrollTop < props.topThreshold!) {
                        /*进入top*/
                        emit.onVerticalScrollTop(e)
                        freezeState.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.top
                    } else if (state.contentHeight - state.hostHeight - freezeState.wrapperScrollTop < props.bottomThreshold!) {
                        /*进入bottom*/
                        emit.onVerticalScrollBottom(e)
                        freezeState.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.bottom
                    }

                } else if (freezeState.verticalPosition === PLAIN_SCROLL_VERTICAL_POSITION.bottom) {
                    if (state.contentHeight - state.hostHeight - freezeState.wrapperScrollTop > props.bottomThreshold!) {
                        /*进入center*/
                        emit.onVerticalScrollCenter(e)
                        freezeState.verticalPosition = PLAIN_SCROLL_VERTICAL_POSITION.center
                    }
                }

                if (props.disableListTransition) {
                    methods.disableListTransition()
                }
            },
        }

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            window.addEventListener('resize', handler.windowResize)
            if (!!popper) {
                popper.event.on.onOpen(handler.popperOpen)
                popper.event.on.onShow(handler.popperShow)
            }
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', handler.windowResize)
            if (!!popper) {
                popper.event.off.onOpen(handler.popperOpen)
                popper.event.off.onShow(handler.popperShow)
            }
        })

        watch(() => props.refreshState, methods.refresh)

        return {
            refer: {
                props,
                on, off,
                targetScrollbarSize,
                refs,
                slots,
                handler,
                methods,
                state,
                freezeState,
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
                                {<VerticalScrollbar/>}
                            </div>
                        )
                    }
                    {
                        !props.hideScrollbar && props.scrollX && (
                            <div class="pl-horizontal-scrollbar-wrapper">
                                {<HorizontalScrollbar/>}
                            </div>
                        )
                    }
                </div>
            )
        }
    },
})

export type PlainScroll = typeof Scroll.use.class

export default Scroll