import PlTreeNode from '../tree/pl-tree-node.vue'

const OldTreeNode = PlTreeNode as any

export default {
    props: {
        treeNode: {type: Object},
    },
    inject: {
        plTree: {},
    },
    data() {
        return {}
    },
    render(h) {
        return (
            <pl-item tag="li" class={this.classes}>
                <div class="pl-virtual-tree-node-expander" style={this.expanderStyles}>
                    {
                        this.isLoading ?
                            <pl-loading type="beta"/>
                            :
                            (!this.treeNode.isLeaf && <pl-icon icon={this.plTree.expandIcon || 'el-icon-arrow-right'} onClick={e => this.plTree.onClickExpandIcon(e, this.treeNode)} class="pl-tree-expand-icon"/>)
                    }
                </div>
                <div class="pl-virtual-tree-node-content" style={this.contentStyles} onClick={() => this.plTree.onClickNodeContent(this.treeNode)}>
                    <span>{this.treeNode.label}</span>
                </div>
            </pl-item>
        )
    },
    computed: {
        // @ts-ignore
        classes() {
            return [
                'pl-virtual-tree-node',
                {
                    'pl-virtual-tree-node-expand': this.isExpand,
                    'pl-virtual-tree-node-current': this.treeNode.key === this.plTree.p_currentKey
                },
                // {'pl-virtual-tree-node-drop-inner': this.plTree.dragState.dropInnerKey === this.treeNode.key}
            ]
        },
        level() {
            return this.treeNode.level - 1
        },
        expanderStyles() {
            const paddingLeft: string = this.level * this.plTree.intent + 'px'
            return {
                paddingLeft
            }
        },
        contentStyles() {
            let paddingLeft = 18
            if (this.plTree.showCheckbox) {
                paddingLeft += 18
            }
            paddingLeft += this.level * this.plTree.intent
            return {
                paddingLeft: paddingLeft + 'px'
            }
        },
        isExpand: OldTreeNode.computed.isExpand,
        isLoading: OldTreeNode.computed.isLoading,
    },
}