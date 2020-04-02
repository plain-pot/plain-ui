import tree from '../tree/pl-tree.vue'
import {TreeMark, TreeNode} from "../tree/tree";

const Tree = tree as any

export default {
    name: "pl-virtual-tree",
    props: {
        ...Tree.props,
    },
    data() {
        const p_data: any[] = this.data
        const p_currentKey: string = null
        const p_loading: boolean = false
        const mark: { [key: string]: TreeMark } = {}
        const formatCount: number = 0
        const rootTreeNode: TreeNode = new TreeNode({}, this, 0)
        return {
            p_data,
            p_loading,
            p_currentKey,
            mark,
            formatCount,
            rootTreeNode,
        }
    },
    render(h) {
        return (
            <div class={this.classes}>
                pl-virtual-tree
            </div>
        )
    },
    created() {
        console.log(this.formatDataFlat)
    },
    computed: {
        classes() {
            return [
                'pl-virtual-tree',
            ]
        },
        formatData: Tree.computed.formatData,
        formatDataFlat() {
            const formatData = this.formatData
            this.iterateAll(formatData, (treeNode: TreeNode) => {
                console.log(treeNode.label)
            })
        },
    },
    methods: {
        formatNodeData: Tree.methods.formatNodeData,
        checkProps: Tree.methods.checkProps,
        setMark: Tree.methods.setMark,
        getMark: Tree.methods.getMark,
        iterateAll: Tree.methods.iterateAll,
    },
}