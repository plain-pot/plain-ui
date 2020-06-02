import {defineComponent} from "@vue/composition-api";
import {TreeNodeProps, useTreeNode} from "@/packages/tree/use/use-tree-node";

export default defineComponent({
    name: 'pl-virtual-tree-node',
    props: {
        ...TreeNodeProps,
    },
    setup(props) {
        const data = useTreeNode(props)

        return () => {
            const nodeOn = {
                ...(!!data.tree.props.draggable ? {
                    dragstart: data.tree.dragState.handler.dragstart,
                    dragend: data.tree.dragState.handler.dragend,
                    dragover: data.tree.dragState.handler.dragover,
                } : {})
            }
            return (
                <pl-item class={data.classes.value} draggable={data.tree.props.draggable} {...{nativeOn: nodeOn}}>
                    {data.methods.getTreeNodeWrapper()}
                </pl-item>
            )
        }
    },
})