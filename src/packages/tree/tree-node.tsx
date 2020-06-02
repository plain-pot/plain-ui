import {defineComponent} from "@vue/composition-api";
import {TreeNodeProps, useTreeNode} from "@/packages/tree/use/use-tree-node";

export default defineComponent({
    name: 'pl-tree-node',
    props: {
        ...TreeNodeProps,
    },
    setup(props) {

        const state = useTreeNode(props)


        return () => {
            return (
                <div>
                    pl tree
                </div>
            )
        }
    },
})