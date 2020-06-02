import {defineComponent} from "@vue/composition-api";
import {TreeProps} from "@/packages/tree/use/use-tree";

export default defineComponent({
    name: 'pl-tree',
    props: {
        ...TreeProps,
    },
    setup(props) {
        return () => (
            <div>
                pl tree
            </div>
        )
    },
})