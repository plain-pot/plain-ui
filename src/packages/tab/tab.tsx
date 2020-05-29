import {defineComponent} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";

export default defineComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},
        val: {},
    },
    setup(props) {
        const ctx = useCollectChild()
        // @ts-ignore
        ctx.props = ctx
        return () => <span>{props.title}</span>
    },
})