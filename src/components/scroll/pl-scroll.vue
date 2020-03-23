<template>
    <div ref="host"
         class="pl-scroll"
         :class="classes"
         v-resize="onHostResize"
         :style="hostStyles">
        <div ref="wrapper"
             class="pl-scroll-wrapper"
             :style="wrapperStyles"
             @scroll="onWrapperScroll">
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
            scrollbarSize: {type: Number},
            scrollbarColor: {type: String, default: 'rgba(144,147,153,.3)'},
            scrollX: {type: Boolean},
            scrollY: {type: Boolean, default: true},
            hideScrollbar: {type: Boolean},
            fitContentWidth: {type: Boolean},
            fitContentHeight: {type: Boolean},
            fitHostWidth: {type: Boolean},
            fitHostHeight: {type: Boolean},
            topThreshold: {type: Number, default: 20},
            bottomThreshold: {type: Number, default: 20},
            disabledScroll: {type: Boolean},
            horizontalScrollbarTooltip: {type: String},
            verticalScrollbarTooltip: {type: String},
        },
        data() {
            const onWindowResize = this.$plain.utils.throttle(() => this.refresh(), 500)

            return {
                p_verticalPosition: 'top',
                p_wrapperScrollTop: 0,
                p_wrapperScrollLeft: 0,

                p_dragTop: 0,
                p_dragY: 0,
                p_dragLeft: 0,
                p_dragX: 0,

                contentWidth: 0,
                contentHeight: 0,
                hostWidth: 0,
                hostHeight: 0,
                hover: false,
                draging: false,

                onWindowResize,
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
            targetScrollBarSize() {
                if (!this.scrollX) {
                    return this.scrollbarSize || 6
                } else {
                    return this.scrollbarSize || 9
                }
            },
            classes() {
                return {
                    'pl-scroll-draging': this.draging,
                    'pl-scroll-disabled': this.disableScroll,
                }
            },
            hostStyles(): CSSStyleDeclaration | null {
                if (!this.isMounted) return null
                let styles = {} as CSSStyleDeclaration

                if (this.fitContentHeight) {
                    styles.height = `${this.contentHeight}px`
                }

                return styles
            },
            wrapperStyles(): CSSStyleDeclaration | null {
                if (!this.isMounted) return null
                let styles = {} as CSSStyleDeclaration

                if (this.fitContentHeight) {
                    styles.height = `${this.contentHeight + 17}px`
                }

                return styles
            },
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
            verticalScrollbarHeight(): number {
                return this.contentHeight > this.hostHeight ? (this.hostHeight * this.hostHeight / this.contentHeight) : 0
            },
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
            horizontalScrollbarWidth(): number {
                return this.contentWidth > this.hostWidth ? (this.hostWidth * this.hostWidth) / this.contentWidth : 0
            },
            horizontalScrollbarLeft(): number {
                return (this.hostWidth - this.horizontalScrollbarWidth) * this.p_wrapperScrollLeft / (this.contentWidth - this.hostWidth)
            },
            horizontalScrollbarStyles(): CSSStyleDeclaration {
                return {
                    height: `${this.targetScrollBarSize}px`,
                    width: `${this.horizontalScrollbarWidth}px`,
                    left: `${this.horizontalScrollbarLeft}px`,
                    backgroundColor: this.scrollbarColor,
                } as CSSStyleDeclaration
            },
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

            scroll(point: { x?: number, y?: number }, time: number | null = null) {
                if (point.x != null) this.wrapper!.scrollLeft = point.x
                if (point.y != null) this.wrapper!.scrollTop = point.y

                /*if (time == null) {
                    if (point.x != null) this.wrapper!.scrollLeft = point.x
                    if (point.y != null) this.wrapper!.scrollTop = point.y
                } else {

                }*/
            },
            scrollTop(scrollTop, time) {
                this.scroll({y: scrollTop}, time)
            },

            scrollEnd(point: { x: boolean, y?: boolean } = {x: true, y: true}) {
                if (!!point.x) this.wrapper!.scrollLeft = this.wrapper!.scrollWidth
                if (!!point.y) this.wrapper!.scrollTop = this.wrapper!.scrollHeight
            },

            /*---------------------------------------listen-------------------------------------------*/

            onContentResize(data: ResizeDetectFuncParam) {
                if (data.width != null) this.contentWidth = data.width
                if (data.height != null) this.contentHeight = data.height
            },

            onHostResize(data: ResizeDetectFuncParam) {
                if (data.width != null) this.hostWidth = data.width - 17
                if (data.height != null) this.hostHeight = data.height - 17
            },

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

            onVerticalDragStart(e: MouseEvent) {
                this.draging = true
                this.p_dragTop = this.verticalScrollbarTop
                this.p_dragY = e.clientY
                document.addEventListener('mousemove', this.onVerticalDragMove)
                document.addEventListener('mouseup', this.onVerticalDragEnd)
                this.$plain.utils.disabledUserSelect()
            },

            onVerticalDragMove(e: MouseEvent) {
                let deltaY = e.clientY - this.p_dragY
                const top = this.p_dragTop + deltaY
                this.wrapper!.scrollTop = top * (this.contentHeight - this.hostHeight) / (this.hostHeight - this.verticalScrollbarHeight)
            },

            onVerticalDragEnd() {
                this.draging = false
                document.removeEventListener('mousemove', this.onVerticalDragMove)
                document.removeEventListener('mouseup', this.onVerticalDragEnd)
                this.$plain.utils.enableUserSelect()
            },

            /*horizontal-drag-start*/

            onHorizontalDragStart(e: MouseEvent) {
                this.draging = true
                this.p_dragLeft = this.horizontalScrollbarLeft
                this.p_dragX = e.clientX
                document.addEventListener('mousemove', this.onHorizontalDragMove)
                document.addEventListener('mouseup', this.onHorizontalDragEnd)
                this.$plain.utils.disabledUserSelect()
            },

            onHorizontalDragMove(e: MouseEvent) {
                let deltaX = e.clientX - this.p_dragX
                const left = this.p_dragLeft + deltaX
                this.wrapper!.scrollLeft = left * (this.contentWidth - this.hostWidth) / (this.hostWidth - this.horizontalScrollbarWidth)
            },

            onHorizontalDragEnd() {
                this.draging = false
                document.removeEventListener('mousemove', this.onHorizontalDragMove)
                document.removeEventListener('mouseup', this.onHorizontalDragEnd)
                this.$plain.utils.enableUserSelect()
            },
        },
    }
</script>