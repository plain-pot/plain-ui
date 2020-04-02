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

        virtual: {type: Boolean},
        width: {},
        height: {},
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
            <div {...{directives}} class={this.classes} style={this.styles}>
                {(!this.formatDataFlat || this.formatDataFlat.length === 0) && (
                    <div class="pl-tree-node-empty-text"
                        key="pl-tree-node-empty-text">
                        <pl-icon icon="el-icon-reading"/>
                        <span>{this.emptyText}</span>
                    </div>
                )}
                {!!this.draggable && <span class="pl-tree-drag-indicator" key="pl-tree-drag-indicator" {...{directives: [{name: 'show', value: this.dragState.show}]}} style={this.indicatorStyles}></span>}

                {!!this.virtual ?
                    <pl-virtual-list data={this.formatDataFlat}
                                     size={24}
                                     contentIs={'pl-list'}
                                     contentProps={{direction: "right"}}
                                     {...{
                                         scopedSlots: {default: ({item, index}) => <pl-virtual-tree-node treeNode={item} key={item.key} vid={index}/>}
                                     }}/> :
                    <pl-list direction="right">
                        {this.formatDataFlat.map((item) => <pl-virtual-tree-node treeNode={item} key={item.key}/>)}
                    </pl-list>
                }
            </div>
        )
    },
    computed: {
        ...Tree.computed,
        styles() {
            const styles = {} as any
            if (!!this.width) styles.width = this.width
            if (!!this.height) styles.height = this.height
            return styles
        },
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
    },
}