import {computed, defineComponent} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {useSlots} from "@/use/useSlots";
import {useScopedSlots} from "@/use/useScopedSlots";

export default defineComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},                          // 标签标题
        init: {type: Boolean},                          // 标签是否立即初始化
        val: {},                                        // 标签唯一标识，没有值则使用title，tab-group根据该值判断显示哪一个tab的内容
        destroyOnHide: {type: Boolean},                 // 是否在关闭页签的时候，销毁内容
    },
    setup(props) {

        const {slots} = useSlots()
        const {scopedSlots} = useScopedSlots({
            head: {active: Boolean},
        })

        const ctx = useCollectChild()
        const targetVal = computed(() => props.val || props.title)

        Object.assign(ctx, {
            props,
            targetVal,
            slots,
            scopedSlots,
        })

        return () => <span>{props.title}</span>
    },
})