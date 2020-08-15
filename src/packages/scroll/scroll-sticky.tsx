import {computed, defineComponent, onBeforeUnmount, onMounted} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {injectScroll} from "@/packages/scroll/scroll";
import {useRefs} from "@/use/useRefs";
import {StyleType} from "@/types/utils";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-scroll-sticky',
    props: {
        top: {type: Number},                                    // 粘粘距离顶部距离
        left: {type: Number},                                   // 粘粘距离左侧距离
        bottom: {type: Number},                                 // 粘粘距离底部距离
        right: {type: Number},                                  // 粘粘距离右侧距离
        zIndex: {type: Number, default: 1},                     // zIndex值
        tag: {type: String, default: 'div'},                    // 跟节点标签
    },
    setup(props) {

        const {slots} = useSlots()

        // 当前dom元素的一些基本信息
        let offset = {top: 0, left: 0, height: 0, width: 0,}
        // 滚动容器的一些基本信息
        let content = {
            width: 0,
            height: 0,
        }

        const Tag = props.tag

        let ie = $plain.utils.ie;
        ie === 'edge' && (ie = false);
        // const ie = true

        const classes = computed(() => {
            return [
                'pl-scroll-sticky',
                {
                    'pl-scroll-sticky-compatible': ie
                }
            ]
        })

        const styles = computed(() => {

            const styles = {} as StyleType
            styles.zIndex = String(props.zIndex)

            if (!ie) {
                if (props.top !== null) styles.top = $plain.utils.suffixPx(props.top)
                if (props.left !== null) styles.left = $plain.utils.suffixPx(props.left)
                if (props.right !== null) styles.right = $plain.utils.suffixPx(props.right)
                if (props.bottom !== null) styles.bottom = $plain.utils.suffixPx(props.bottom)
            }

            return styles
        })

        if (ie) {
            const refs = useRefs()
            const scroll = injectScroll()

            function fresh(data: { scrollTop: number, scrollLeft: number }) {
                const {scrollTop, scrollLeft} = data

                if (props.top != null) {
                    refs.$el.style.top = (Math.max(0, scrollTop - (offset.top - props.top))) + 'px'
                }

                if (props.bottom != null) {
                    refs.$el.style.bottom = Math.max(0, offset.top + offset.height - content.height - scrollTop + props.bottom) + 'px'
                }

                if (props.left != null) {
                    refs.$el.style.left = (Math.max(0, scrollLeft - (offset.left - props.left))) + 'px'
                }

                if (props.right != null) {
                    refs.$el.style.right = Math.max(0, offset.left + offset.width - content.width - scrollLeft + props.right) + 'px'
                }
            }

            function onScroll(e) {
                fresh({
                    scrollTop: e.target.scrollTop,
                    scrollLeft: e.target.scrollLeft,
                })
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

                    fresh({scrollLeft: 0, scrollTop: 0})
                }, 0)
            })
        }

        return () => {
            return (
                <Tag class={classes.value} style={styles.value}>
                    {slots.default()}
                </Tag>
            )
        }
    }
})