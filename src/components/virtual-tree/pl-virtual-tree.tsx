import tree from '../tree/pl-tree.vue'
import {TreeMark, TreeNode} from "../tree/tree";
import PlVirtualTreeNode from './pl-virtual-tree-node'

const Tree = tree as any

export default {
    name: "pl-virtual-tree",
    components: {PlVirtualTreeNode},
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
            <pl-list tag="ul" class={this.classes} direction="right">
                {this.formatDataFlat.map((item) => <pl-virtual-tree-node treeNode={item} key={item.key}/>)}
            </pl-list>
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
        /**
         * formatData偏平格式化
         * @author  韦胜健
         * @date    2020/4/2 9:58
         */
        formatDataFlat() {
            const formatData = this.formatData
            const formatDataFlat = []
            this.iterateAll(formatData, (treeNode: TreeNode) => {
                formatDataFlat.push(treeNode)
            }, (treeNode: TreeNode) => {
                return treeNode.isExpand
            })
            return formatDataFlat
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