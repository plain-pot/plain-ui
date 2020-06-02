import {computed, defineComponent} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";

export default defineComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},
        val: {},
    },
    setup(props) {
        const ctx = useCollectChild()
        const targetVal = computed(() => props.val || props.title)

        Object.assign(ctx, {
            props,
            targetVal,
        })

        return () => <span>{props.title}</span>
    },
})