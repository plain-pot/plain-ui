import {computed, defineComponent, onBeforeUnmount, onMounted} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {injectScroll} from "@/packages/scroll/scroll";
import {useRefs} from "@/use/useRefs";

export default defineComponent({
    name: 'pl-scroll-sticky',
    props: {
        top: {type: Number},
        left: {type: Number},
        bottom: {type: Number},
        right: {type: Number},
        zIndex: {type: Number, default: 1},
    },
    setup(props) {

        const {slots} = useSlots()
        const refs = useRefs()
        const scroll = injectScroll()

        let offset = {
            top: 0,
            left: 0,
            height: 0,
            width: 0,
        }
        let content = {
            width: 0,
            height: 0,
        }

        const classes = computed(() => {
            return [
                'pl-scroll-sticky',
                'pl-scroll-sticky-compatible',
            ]
        })

        const styles = computed(() => {
            return {
                zIndex: props.zIndex
            }
        })

        function fresh(scrollTop: number) {
            if (props.top != null) {
                refs.$el.style.top = (Math.max(0, scrollTop - (offset.top - props.top))) + 'px'
            }

            if (props.bottom != null) {
                refs.$el.style.bottom = Math.max(0, offset.top + offset.height - content.height - scrollTop) + 'px'
            }
        }

        function onScroll(e) {
            fresh(e.target.scrollTop)
        }

        scroll.on.scroll(onScroll)

        onBeforeUnmount(() => scroll.off.scroll(onScroll));

        onMounted(() => {
            setTimeout(() => {
                offset.top = refs.$el.offsetTop
                offset.left = refs.$el.offsetLeft
                offset.width = refs.$el.offsetWidth
                offset.height = refs.$el.offsetHeight

                content.width = scroll.state.hostWidth
                content.height = scroll.state.hostHeight

                fresh(0)
            }, 0)
        })

        return () => {
            return (
                <div class={classes.value} style={styles.value}>
                    {slots.default()}
                </div>
            )
        }
    }
})