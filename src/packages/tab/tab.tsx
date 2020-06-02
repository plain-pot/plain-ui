import {computed, defineComponent} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},
        val: {},
    },
    setup(props) {

        const {slots} = useSlots()

        const ctx = useCollectChild()
        const targetVal = computed(() => props.val || props.title)

        Object.assign(ctx, {
            props,
            targetVal,
            slots,
        })

        return () => <span>{props.title}</span>
    },
})