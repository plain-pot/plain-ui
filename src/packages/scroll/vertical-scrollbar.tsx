import {designComponent} from "../../use/designComponent";
import Scroll from './scroll'
import {reactive, computed} from 'vue';
import {useStyles} from "../../use/useStyles";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";

export const VerticalScrollbar = designComponent({
    setup() {

        const scroll = Scroll.use.inject()

        const dragState = {
            top: 0,
            clientY: 0,
        }

        const state = reactive({
            scrollTop: 0,
        })

        const height = computed(() => {
            return scroll.state.contentHeight > scroll.state.hostHeight ?
                (scroll.state.hostHeight * scroll.state.hostHeight / scroll.state.contentHeight)
                : 0
        })
        const top = computed(() => {
            return (scroll.state.hostHeight - height.value) * state.scrollTop / (scroll.state.contentHeight - scroll.state.hostHeight)
        })

        const styles = useStyles(() => {
            return {
                height: `${height.value}px`,
                width: `${scroll.targetScrollbarSize.value}px`,
                top: `${top.value}px`,
                backgroundColor: scroll.props.scrollbarColor,
            }
        })

        const handler = {
            onScroll: (e: Event) => {
                state.scrollTop = (e.target as HTMLElement).scrollTop
            },
            onMousedown: (e: MouseEvent) => {
                scroll.freezeState.isDragging = true
                dragState.top = top.value
                dragState.clientY = e.clientY
                document.addEventListener('mousemove', handler.onMousemove)
                document.addEventListener('mouseup', handler.onMouseup)
                disabledUserSelect()
            },
            onMousemove: (e: MouseEvent) => {
                let deltaY = e.clientY - dragState.clientY
                let top = dragState.top + deltaY
                let scrollTop = top * (scroll.state.contentHeight - scroll.state.hostHeight) / (scroll.state.hostHeight - height.value)
                scrollTop = Math.max(0, Math.min(scrollTop, scroll.state.contentHeight - scroll.state.hostHeight))
                if (!scroll.props.scrollAfterDragEnd) {
                    scroll.refs.wrapper.scrollTop = scrollTop
                } else {
                    /*滚动条发生位移，但是内容scrollTop暂时不变*/
                    state.scrollTop = scrollTop
                }
            },
            onMouseup: (e: MouseEvent) => {
                scroll.freezeState.isDragging = false
                document.removeEventListener('mousemove', handler.onMousemove)
                document.removeEventListener('mouseup', handler.onMouseup)
                enableUserSelect()

                if (scroll.props.scrollAfterDragEnd) {
                    let deltaY = e.clientY - dragState.clientY
                    let top = dragState.top + deltaY
                    scroll.refs.wrapper.scrollTop = top * (scroll.state.contentHeight - scroll.state.hostHeight) / (scroll.state.hostHeight - height.value)
                }
            },
        }

        scroll.on.onScroll(handler.onScroll)

        return {
            render: () => {
                return (
                    <div class="pl-vertical-scrollbar-wrapper">
                        <div class="pl-vertical-scrollbar"
                             style={styles.value}
                             onMousedown={handler.onMousedown}
                        />
                    </div>
                )
            }
        }
    },
})