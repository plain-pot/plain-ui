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
    },
    setup(props) {

        const {slots} = useSlots()
        const refs = useRefs()
        const scroll = injectScroll()

        let offsetTop = 0
        let offSetLeft = 0

        const classes = computed(() => {
            return [
                'pl-scroll-sticky',
                'pl-scroll-sticky-compatible',
            ]
        })

        function onScroll(e) {
            refs.$el.style.top = (Math.max(0, e.target.scrollTop - offsetTop)) + 'px'
        }

        scroll.on.scroll(onScroll)

        onBeforeUnmount(() => scroll.off.scroll(onScroll));

        onMounted(() => {
            offsetTop = refs.$el.offsetTop
            offSetLeft = refs.$el.offsetLeft
        })

        return () => {
            return (
                <div class={classes.value}>
                    {slots.default()}
                </div>
            )
        }
    }
})