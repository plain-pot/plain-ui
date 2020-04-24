<template>
    <div ref="host"
         class="pl-scroll"
         :class="classes"
         v-resize="onHostResize"
         :style="hostStyles">
        <div ref="wrapper"
             class="pl-scroll-wrapper"
             :style="wrapperStyles"
             @scroll="onWrapperScroll"
             @mousewheel="onWrapperMouseWheel">
            <div ref="content"
                 class="pl-scroll-content"
                 :style="contentStyles"
                 v-resize="onContentResize">
                <slot></slot>
            </div>
        </div>

        <div class="pl-vertical-scrollbar-wrapper" v-if="!hideScrollbar && scrollY">
            <div class="pl-vertical-scrollbar"
                 :style="verticalScrollbarStyles"
                 @mousedown="onVerticalDragStart">
            </div>
        </div>
        <div class="pl-horizontal-scrollbar-wrapper" v-if="!hideScrollbar && scrollX">
            <div class="pl-horizontal-scrollbar"
                 :style="horizontalScrollbarStyles"
                 @mousedown="onHorizontalDragStart">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ResizeDetectFuncParam} from "src/types/utils";
    import {ResizeDetectorDirective} from "src/utils/ResizeDetector";
    import {MountedMixin} from "src/utils/mixins";

    export default {
        name: "pl-scroll",
        directives: {resize: ResizeDetectorDirective},
        mixins: [MountedMixin],
        inject: {
            plPopper: {default: null}
        },
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
            // disabledScroll: {type: Boolean},                                                                // 禁用滚动
            // horizontalScrollbarTooltip: {type: String},                                                     // 横向滚动条 tooltip
            // verticalScrollbarTooltip: {type: String},                                                       // 纵向滚动条 tooltip
        },
        data() {
            const onWindowResize = this.$plain.utils.throttle(() => this.refresh(), 500)

            return {
                p_verticalPosition: 'top',                                                                  // 当前纵向滚动条位置：top,center,bottom
                p_wrapperScrollTop: 0,                                                                      // 当前纵向滚动scrollTop
                p_wrapperScrollLeft: 0,                                                                     // 当前横向滚动scrollLeft

                p_dragTop: 0,                                                                               // 纵向滚动条距离顶部距离
                p_dragY: 0,                                                                                 // 拖拽纵向滚动条鼠标y轴开始位置
                p_dragLeft: 0,                                                                              // 横向滚动条距离左侧距离
                p_dragX: 0,                                                                                 // 拖拽横向滚动条鼠标x轴开始位置

                contentWidth: 0,                                                                            // 内容宽度
                contentHeight: 0,                                                                           // 内容高度
                hostWidth: 0,                                                                               // 容器宽度
                hostHeight: 0,                                                                              // 容器高度
                hover: false,                                                                               // 当前是否鼠标覆盖在上方
                draging: false,                                                                             // 当前是否处于拖拽状态

                onWindowResize,                                                                             // 处理window resize事件，重新计算大小
            }
        },
        mounted() {
            window.addEventListener('resize', this.onWindowResize)

            // popper 中的 scroll 自动刷新
            this.popperHandler = {
                open: () => {
                    this.refresh()
                },
                show: () => {
                    this.$nextTick(() => this.scroll({y: 0}))
                },
            }

            if (!!this.plPopper) {
                this.plPopper.$on('open', this.popperHandler.open)
                this.plPopper.$on('show', this.popperHandler.show)
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onWindowResize)
            if (!!this.cancelAnimate) {
                cancelAnimationFrame(this.cancelAnimate)
            }

            if (!!this.plPopper) {
                this.plPopper.$off('open', this.popperHandler.open)
                this.plPopper.$off('show', this.popperHandler.show)
            }
        },
        computed: {
            /*---------------------------------------ref-------------------------------------------*/
            host: {
                cache: false,
                get() {
                    return this.$refs.host
                }
            },
            wrapper: {
                cache: false,
                get() {
                    return this.$refs.wrapper
                },
            },
            content: {
                cache: false,
                get() {
                    return this.$refs.content
                },
            },
            /*---------------------------------------computed-------------------------------------------*/
            /**
             * 滚动条大小
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            targetScrollBarSize() {
                if (!this.scrollX) {
                    return this.scrollbarSize || 6
                } else {
                    return this.scrollbarSize || 9
                }
            },
            /**
             * 根节点class
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            classes() {
                return {
                    'pl-scroll-draging': this.draging,
                    'pl-scroll-disabled': this.disableScroll,
                    'pl-scroll-always-show-scroll-bar': this.alwaysShowScrollbar,
                }
            },
            /**
             * 容器style
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            hostStyles(): CSSStyleDeclaration | null {
                if (!this.isMounted) return null
                let styles = {} as CSSStyleDeclaration

                if (this.fitContentHeight) {
                    styles.height = `${this.contentHeight}px`
                }

                return styles
            },
            /**
             * wrapper节点style
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            wrapperStyles(): CSSStyleDeclaration | null {
                if (!this.isMounted) return null
                let styles = {} as CSSStyleDeclaration

                if (this.fitContentHeight) {
                    styles.height = `${this.contentHeight + 17}px`
                }

                return styles
            },
            /**
             * content节点style
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            contentStyles(): CSSStyleDeclaration | null {
                if (!this.isMounted) return null
                const styles = {} as CSSStyleDeclaration

                if (!this.scrollX) {
                    styles.width = this.fitContentWidth && this.contentWidth > 0 ? `${this.contentWidth}px` : `100%`;
                    styles.overflowX = 'hidden'
                }

                if (!this.scrollY) {
                    styles.height = this.fitContentHeight && this.contentHeight > 0 ? `${this.height}px` : `100%`;
                    styles.overflowY = 'hidden'
                }

                if (this.fitHostHeight) {
                    styles.height = '100%'
                }
                if (this.fitHostWidth) {
                    styles.width = '100%'
                }
                if (this.fitContentWidth) {
                    styles.width = `${this.contentWidth}px`
                }
                if (this.fitContentHeight) {
                    styles.width = `${this.contentHeight}px`
                }

                return styles
            },
            /**
             * 纵向滚动条高度
             * @author  韦胜健
             * @date    2020/3/23 19:31
             */
            verticalScrollbarHeight(): number {
                return this.contentHeight > this.hostHeight ? (this.hostHeight * this.hostHeight / this.contentHeight) : 0
            },
            /**
             * 纵向滚动条距离顶部位置
             * @author  韦胜健
             * @date    2020/3/23 19:32
             */
            verticalScrollbarTop(): number {
                /*const {
                    hostHeight,
                    contentHeight,
                    verticalScrollbarHeight,
                    p_wrapperScrollTop,
                } = this

                console.log({
                    hostHeight,
                    contentHeight,
                    verticalScrollbarHeight,
                    p_wrapperScrollTop,
                })*/
                return (this.hostHeight - this.verticalScrollbarHeight) * this.p_wrapperScrollTop / (this.contentHeight - this.hostHeight)
            },
            /**
             * 横向滚动条宽度
             * @author  韦胜健
             * @date    2020/3/23 19:32
             */
            horizontalScrollbarWidth(): number {
                return this.contentWidth > this.hostWidth ? (this.hostWidth * this.hostWidth) / this.contentWidth : 0
            },
            /**
             * 横向滚动条距离左侧距离
             * @author  韦胜健
             * @date    2020/3/23 19:32
             */
            horizontalScrollbarLeft(): number {
                return (this.hostWidth - this.horizontalScrollbarWidth) * this.p_wrapperScrollLeft / (this.contentWidth - this.hostWidth)
            },
            /**
             * 横向滚动条样式 style
             * @author  韦胜健
             * @date    2020/3/23 19:32
             */
            horizontalScrollbarStyles(): CSSStyleDeclaration {
                return {
                    height: `${this.targetScrollBarSize}px`,
                    width: `${this.horizontalScrollbarWidth}px`,
                    left: `${this.horizontalScrollbarLeft}px`,
                    backgroundColor: this.scrollbarColor,
                } as CSSStyleDeclaration
            },
            /**
             * 纵向滚动条样式 style
             * @author  韦胜健
             * @date    2020/3/23 19:32
             */
            verticalScrollbarStyles(): CSSStyleDeclaration {
                return {
                    height: `${this.verticalScrollbarHeight}px`,
                    width: `${this.targetScrollBarSize}px`,
                    top: `${this.verticalScrollbarTop}px`,
                    backgroundColor: this.scrollbarColor,
                } as CSSStyleDeclaration
            },
        },
        methods: {
            /**
             * 刷新
             * @author  韦胜健
             * @date    2020/3/23 19:33
             */
            async refresh() {
                await this.$plain.nextTick()
                const {scrollWidth: width1, scrollHeight: height1} = this.content
                this.onContentResize({
                    width: Math.ceil(width1),
                    height: Math.ceil(height1),
                })

                const {scrollWidth: width2, scrollHeight: height2} = this.host
                this.onHostResize({
                    width: Math.ceil(width2),
                    height: Math.ceil(height2),
                })

                // console.log({width1, height1, width2, height2})

                // this.wrapper!.scrollTop = 0
            },
            /**
             * 滚动到指定位置
             * @author  韦胜健
             * @date    2020/3/23 19:33
             */
            scroll(point: { x?: number, y?: number }, time: number | null = null) {

                if (!this.wrapper) return

                // if (point.x != null) this.wrapper!.scrollLeft = point.x
                // if (point.y != null) this.wrapper!.scrollTop = point.y
                if (time == null) {
                    if (point.x != null) this.wrapper!.scrollLeft = point.x
                    if (point.y != null) this.wrapper!.scrollTop = point.y
                } else {

                    if (!!this.cancelAnimate) {
                        cancelAnimationFrame(this.cancelAnimate)
                        this.cancelAnimate = null
                    }

                    let ny = this.wrapper!.scrollTop
                    let nx = this.wrapper!.scrollLeft

                    let ky = (point.y - ny) / time
                    let kx = (point.x - nx) / time

                    let startTime = Date.now()
                    const run = () => {
                        let nowTime = Date.now()
                        let delta = nowTime - startTime
                        let top;
                        let left;

                        if (delta >= time) {
                            this.cancelAnimate = null
                            top = time * ky + ny
                            left = time * kx + nx

                            this.wrapper!.scrollTop = top
                            this.wrapper!.scrollLeft = left
                        } else {
                            top = delta * ky + ny
                            left = delta * kx + nx

                            this.wrapper!.scrollTop = top
                            this.wrapper!.scrollLeft = left
                            this.cancelAnimate = requestAnimationFrame(run)
                        }
                    }
                    run()
                }
            },
            /**
             * 纵向滚动到指定位置
             * @author  韦胜健
             * @date    2020/3/23 19:33
             */
            scrollTop(scrollTop, time) {
                this.scroll({y: scrollTop}, time)
            },
            /**
             * 滚动到结束位置
             * @author  韦胜健
             * @date    2020/3/23 19:33
             */
            scrollEnd(point: { x: boolean, y?: boolean } = {x: true, y: true}) {
                if (!!point.x) this.wrapper!.scrollLeft = this.wrapper!.scrollWidth
                if (!!point.y) this.wrapper!.scrollTop = this.wrapper!.scrollHeight
            },

            /*---------------------------------------listen-------------------------------------------*/

            /**
             * 处理内容大小变化
             * @author  韦胜健
             * @date    2020/3/23 19:34
             */
            onContentResize(data: ResizeDetectFuncParam) {
                if (data.width != null) this.contentWidth = data.width
                if (data.height != null) this.contentHeight = data.height
            },
            /**
             * 处理容器大小变化
             * @author  韦胜健
             * @date    2020/3/23 19:34
             */
            onHostResize(data: ResizeDetectFuncParam) {
                if (data.width != null) this.hostWidth = data.width - 17
                if (data.height != null) this.hostHeight = data.height - 17
            },
            /**
             * 处理wrapper节点中发生的滚轮事件，如果动画正在执行，则终止动画
             * @author  韦胜健
             * @date    2020/3/23 19:34
             */
            onWrapperMouseWheel() {
                if (!!this.cancelAnimate) {
                    cancelAnimationFrame(this.cancelAnimate)
                    this.cancelAnimate = null
                }
            },
            /**
             * 处理 wrapper 节点滚动事件
             * @author  韦胜健
             * @date    2020/3/23 19:34
             */
            onWrapperScroll(e: any) {
                const target = e.target as HTMLElement
                this.p_wrapperScrollTop = target.scrollTop
                this.p_wrapperScrollLeft = target.scrollLeft

                this.$emit('scroll', e)

                if (this.p_verticalPosition === 'top' && this.p_wrapperScrollTop > this.topThreshold!) {
                    /*进入center*/
                    this.$emit('vertical-scroll-center')
                    this.p_verticalPosition = 'center'
                } else if (this.p_verticalPosition === 'center') {
                    // console.log(this.contentHeight - this.hostHeight - this.contentWrapperScrollTop, this.bottomScrollDuration)
                    if (this.p_wrapperScrollTop < this.topThreshold!) {
                        /*进入top*/
                        this.$emit('vertical-scroll-top')
                        this.p_verticalPosition = 'top'
                    } else if (this.contentHeight - this.hostHeight - this.p_wrapperScrollTop < this.bottomThreshold!) {
                        /*进入bottom*/
                        this.$emit('vertical-scroll-bottom')
                        this.p_verticalPosition = 'bottom'
                    }

                } else if (this.p_verticalPosition === 'bottom') {
                    if (this.contentHeight - this.hostHeight - this.p_wrapperScrollTop > this.bottomThreshold!) {
                        /*进入center*/
                        this.$emit('vertical-scroll-center')
                        this.p_verticalPosition = 'center'
                    }
                }
            },

            /*vertical-drag-start*/

            /**
             * 开始拖拽纵向滚动条垂直滚动
             * @author  韦胜健
             * @date    2020/3/23 19:35
             */
            onVerticalDragStart(e: MouseEvent) {
                this.draging = true
                this.p_dragTop = this.verticalScrollbarTop
                this.p_dragY = e.clientY
                document.addEventListener('mousemove', this.onVerticalDragMove)
                document.addEventListener('mouseup', this.onVerticalDragEnd)
                this.$plain.utils.disabledUserSelect()
            },

            /**
             * 正在拖拽纵向滚动条动作
             * @author  韦胜健
             * @date    2020/3/23 19:35
             */
            onVerticalDragMove(e: MouseEvent) {
                let deltaY = e.clientY - this.p_dragY
                const top = this.p_dragTop + deltaY
                this.wrapper!.scrollTop = top * (this.contentHeight - this.hostHeight) / (this.hostHeight - this.verticalScrollbarHeight)
            },

            /**
             * 纵向滚动条拖拽结束动作
             * @author  韦胜健
             * @date    2020/3/23 19:35
             */
            onVerticalDragEnd() {
                this.draging = false
                document.removeEventListener('mousemove', this.onVerticalDragMove)
                document.removeEventListener('mouseup', this.onVerticalDragEnd)
                this.$plain.utils.enableUserSelect()
            },

            /*horizontal-drag-start*/

            /**
             * 横向滚动条开始拖拽动作
             * @author  韦胜健
             * @date    2020/3/23 19:36
             */
            onHorizontalDragStart(e: MouseEvent) {
                this.draging = true
                this.p_dragLeft = this.horizontalScrollbarLeft
                this.p_dragX = e.clientX
                document.addEventListener('mousemove', this.onHorizontalDragMove)
                document.addEventListener('mouseup', this.onHorizontalDragEnd)
                this.$plain.utils.disabledUserSelect()
            },

            /**
             * 横向滚动条正在拖拽动作
             * @author  韦胜健
             * @date    2020/3/23 19:37
             */
            onHorizontalDragMove(e: MouseEvent) {
                let deltaX = e.clientX - this.p_dragX
                const left = this.p_dragLeft + deltaX
                this.wrapper!.scrollLeft = left * (this.contentWidth - this.hostWidth) / (this.hostWidth - this.horizontalScrollbarWidth)
            },

            /**
             * 横向滚动条拖拽结束动作
             * @author  韦胜健
             * @date    2020/3/23 19:37
             */
            onHorizontalDragEnd() {
                this.draging = false
                document.removeEventListener('mousemove', this.onHorizontalDragMove)
                document.removeEventListener('mouseup', this.onHorizontalDragEnd)
                this.$plain.utils.enableUserSelect()
            },
        },
    }
</script>