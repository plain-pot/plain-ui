import {designComponent} from "../../use/designComponent";
import Scroll from "./scroll";
import {reactive, computed} from 'vue';
import {useStyles} from "../../use/useStyles";

export const HorizontalScrollbar = designComponent({
    setup() {

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
            }
        }

        scroll.on.scroll(handler.onScroll)

        return {
            render: () => {
                return (
                    <div class="pl-horizontal-scrollbar-wrapper">
                        <div class="pl-horizontal-scrollbar" style={styles.value}/>
                    </div>
                )
            }
        }
    },
})