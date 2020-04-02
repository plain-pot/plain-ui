import tree from '../tree/pl-tree.vue'
import {TreeMark, TreeNode} from "../tree/tree";
import PlVirtualTreeNode from './pl-virtual-tree-node'

const Tree = tree as any

export default {
    name: "pl-virtual-tree",
    components: {PlVirtualTreeNode},
    mixins: Tree.mixins,
    emitters: Tree.emitters,
    props: {
        ...Tree.props,
    },
    provide() {
        return {
            plTree: this,
        }
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
            <pl-list tag="ul" class={this.classes} direction="top">
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
                return treeNode.isExpand === true
            })
            return formatDataFlat
        },
    },
    methods: {

        /*---------------------------------------methods-------------------------------------------*/
        /*current*/
        setCurrent: Tree.methods.setCurrent,
        getCurrent: Tree.methods.getCurrent,
        /*expand*/
        expand: Tree.methods.expand,
        collapse: Tree.methods.collapse,
        toggleExpand: Tree.methods.toggleExpand,
        expandAll: Tree.methods.expandAll,
        collapseAll: Tree.methods.collapseAll,
        /*check*/
        check: Tree.methods.check,
        uncheck: Tree.methods.uncheck,
        toggleCheck: Tree.methods.toggleCheck,
        checkAll: Tree.methods.checkAll,
        uncheckAll: Tree.methods.uncheckAll,
        getCheckedData: Tree.methods.getCheckedData,

        /*---------------------------------------utils-------------------------------------------*/
        setMark: Tree.methods.setMark,
        getMark: Tree.methods.getMark,
        iterateAll: Tree.methods.iterateAll,
        checkProps: Tree.methods.checkProps,
        formatNodeData: Tree.methods.formatNodeData,
        findTreeNodeByKey: Tree.methods.findTreeNodeByKey,
        getChildrenAsync: Tree.methods.getChildrenAsync,
        handleKeys: Tree.methods.handleKeys,

        /*---------------------------------------helper-------------------------------------------*/
        initLazy: Tree.methods.initLazy,

        /*---------------------------------------handler-------------------------------------------*/
        onClickExpandIcon: Tree.methods.onClickExpandIcon,
        onClickNodeContent: Tree.methods.onClickNodeContent,
        onClickCheckbox: Tree.methods.onClickCheckbox,
    },
}