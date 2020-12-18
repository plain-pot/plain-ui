import {designComponent} from "../../use/designComponent";
import Scroll from "./scroll";
import {reactive, computed, withDirectives, resolveDirective} from 'vue';
import {useStyles} from "../../use/useStyles";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";

export const HorizontalScrollbar = designComponent({
    props: {
        tooltip: {type: String},
    },
    setup({props}) {

        const dragState = {
            left: 0,
            clientX: 0,
        }

        const scroll = Scroll.use.inject()

        const state = reactive({
            scrollLeft: 0,
        })

        const width = computed(() => {
            return scroll.state.contentWidth > scroll.state.hostWidth ? (scroll.state.hostWidth * scroll.state.hostWidth) / scroll.state.contentWidth : 0
        })
        const left = computed(() => {
            return (scroll.state.hostWidth - width.value) * state.scrollLeft / (scroll.state.contentWidth - scroll.state.hostWidth)
        })
        const styles = useStyles(() => ({
            height: `${scroll.targetScrollbarSize.value}px`,
            width: `${width.value}px`,
            left: `${left.value}px`,
            backgroundColor: scroll.props.scrollbarColor,
        }))

        const handler = {
            onScroll: (e: Event) => {
                state.scrollLeft = (e.target as HTMLElement).scrollLeft
            },
            onMousedown: (e: MouseEvent) => {
                scroll.freezeState.isDragging = true
                dragState.left = left.value
                dragState.clientX = e.clientX
                document.addEventListener('mousemove', handler.onMousemove)
                document.addEventListener('mouseup', handler.onMouseup)
                disabledUserSelect()
            },
            onMousemove: (e: MouseEvent) => {
                let deltaX = e.clientX - dragState.clientX
                const left = dragState.left + deltaX
                let scrollLeft = left * (scroll.state.contentWidth - scroll.state.hostWidth) / (scroll.state.hostWidth - width.value)
                scrollLeft = Math.max(0, Math.min(scrollLeft, scroll.state.contentWidth - scroll.state.hostWidth))
                if (!scroll.props.scrollAfterDragEnd) {
                    scroll.refs.wrapper.scrollLeft = scrollLeft
                } else {
                    state.scrollLeft = scrollLeft
                }
            },
            onMouseup: (e: MouseEvent) => {
                scroll.freezeState.isDragging = false
                document.removeEventListener('mousemove', handler.onMousemove)
                document.removeEventListener('mouseup', handler.onMouseup)
                enableUserSelect()

                if (scroll.props.scrollAfterDragEnd) {
                    let deltaX = e.clientX - dragState.clientX
                    const left = dragState.left + deltaX
                    scroll.refs.wrapper.scrollLeft = left * (scroll.state.contentWidth - scroll.state.hostWidth) / (scroll.state.hostWidth - width.value)
                }
            },
        }

        scroll.on.onScroll(handler.onScroll)

        return {
            render: () => {
                let content = <div class="pl-horizontal-scrollbar" style={styles.value} onMousedown={handler.onMousedown}/> as any
                if (!!props.tooltip) {
                    const TooltipDirective = resolveDirective('tooltip')
                    if (!!TooltipDirective) {
                        content = withDirectives(content, [[TooltipDirective, props.tooltip]])
                    }
                }
                return (
                    <div class="pl-horizontal-scrollbar-wrapper">
                        {content}
                    </div>
                )
            }
        }
    },
})