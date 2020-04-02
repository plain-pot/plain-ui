import tree from '../tree/pl-tree.vue'
import {TreeNode} from "../tree/tree";
import PlVirtualTreeNode from './pl-virtual-tree-node'

const Tree = tree as any

export default {
    name: "pl-virtual-tree",
    components: {PlVirtualTreeNode},
    mixins: Tree.mixins,
    provide() {
        return {
            plTree: this,
        }
    },
    props: {
        ...Tree.props,
    },
    emitters: Tree.emitters,
    data: Tree.data,
    watch: Tree.watch,
    created: Tree.created,
    mounted() {
    },
    render(h) {
        const directives = [{name: 'loading', value: this.isLoading}]

        return (
            <div class="pl-virtual-tree" style={{width: '300px', height: '500px'}} {...{directives}}>
                <pl-virtual-list data={this.formatDataFlat} size={24} renderContent={this.renderVirtualListContent}/>
            </div>
        )
    },
    computed: {
        ...Tree.computed,
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
            return formatDataFlat.filter((treeNode: TreeNode) => !!treeNode.isVisible)
        },
    },
    methods: {
        ...Tree.methods,
        renderVirtualListContent(h, list) {
            list = list.map(item => item.item)

            return (
                <pl-list tag="ul" class={this.classes} direction="right">
                    {list.map((item) => <pl-virtual-tree-node treeNode={item} key={item.key}/>)}
                    {(!list || list.length === 0) && (
                        <li class="pl-tree-node-empty-text" key="pl-tree-node-empty-text">
                            <pl-icon icon="el-icon-reading"/>
                            <span>{this.emptyText}</span>
                        </li>
                    )}
                    {!!this.draggable && <span class="pl-tree-drag-indicator" key="pl-tree-drag-indicator" {...{directives: [{name: 'show', value: this.dragState.show}]}} style={this.indicatorStyles}></span>}
                </pl-list>
            )
        },
    },
}