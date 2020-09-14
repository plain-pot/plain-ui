import {defineComponent} from "@vue/composition-api";
import {TreeNodeProps, useTreeNode} from "@/packages/tree/use/use-tree-node";

export default defineComponent({
    name: 'pl-tree-node',
    props: {
        ...TreeNodeProps,
    },
    setup(props) {

        const data = useTreeNode(props)

        return () => {

            const nodeDirectives = [{
                name: 'show',
                value: props.treeNode.isVisible
            }]
            const nodeOn = {
                ...(!!data.tree.props.draggable ? {
                    dragstart: data.tree.dragState.handler.dragstart,
                    dragend: data.tree.dragState.handler.dragend,
                    dragover: data.tree.dragState.handler.dragover,
                } : {})
            }

            const nodeListDirectives = [{
                name: 'show',
                value: data.isExpand.value && data.state.show
            }]

            return (
                <div class={data.classes.value} {...{directives: nodeDirectives, on: nodeOn}} draggable={data.tree.props.draggable}>
                    {data.methods.getTreeNodeWrapper()}

                    <pl-collapse-transition>
                        {!props.treeNode.isLeaf && data.state.init && <div class="pl-tree-node-list" {...{directives: nodeListDirectives}}>
                            {!!props.treeNode.children && props.treeNode.children.length > 0 ?
                                props.treeNode.children.map((item, index) => <pl-tree-node key={index} tree-node={item}/>)
                                :
                                <div class="pl-tree-node-empty-text" style={data.getEmptyTextStyle()}>
                                    <pl-icon icon="el-icon-reading"/>
                                    <span>{data.tree.props.emptyText}</span>
                                </div>
                            }
                        </div>}
                    </pl-collapse-transition>
                </div>
            )
        }
    },
})