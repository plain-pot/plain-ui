import {designComponent} from "../../use/designComponent";
import Scroll from './scroll'
import {reactive, computed} from 'vue';
import {useStyles} from "../../use/useStyles";

export const VerticalScrollbar = designComponent({
    setup() {

        const scroll = Scroll.use.inject()

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
            }
        }

        scroll.on.scroll(handler.onScroll)

        return {
            render: () => {
                return (
                    <div class="pl-vertical-scrollbar-wrapper">
                        <div class="pl-vertical-scrollbar" style={styles.value}/>
                    </div>
                )
            }
        }
    },
})