import PlTreeNode from '../tree/pl-tree-node.vue'

const OldTreeNode = PlTreeNode as any

export default {
    name: 'pl-virtual-tree-node',
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
        const nodeOn = {
            ...(!!this.plTree.draggable ? {
                dragstart: this.plTree.dragState.dragstart,
                dragend: this.plTree.dragState.dragend,
                dragover: this.plTree.dragState.dragover,
            } : {})
        }
        return (
            <pl-item class={this.classes} draggable={this.plTree.draggable} {...{nativeOn: nodeOn}}>
                <div class="pl-tree-node-wrapper">
                    <div class="pl-tree-node-operator" style={this.expanderStyles}>
                            <span class="pl-tree-node-expander">
                                {
                                    this.treeNode.isLoading ?
                                        <pl-loading type="beta"/>
                                        :
                                        (!this.treeNode.isLeaf && <pl-icon icon={this.plTree.expandIcon || 'el-icon-arrow-right'} onClick={e => this.plTree.onClickExpandIcon(e, this.treeNode)} class="pl-tree-expand-icon"/>)
                                }
                            </span>
                        {!!this.plTree.showCheckbox && <pl-checkbox-indeterminate
                            checkboxProps={{value: this.treeNode.checkStatus === 'check'}}
                            status={this.treeNode.checkStatus}
                            disabled={this.isDisabled || !this.treeNode.isCheckable}
                            {...{nativeOn: {click: e => this.plTree.onClickCheckbox(e, this.treeNode)}}}
                        />}
                    </div>
                    <div class="pl-tree-node-content" onclick={() => this.plTree.onClickNodeContent(this.treeNode)} style={this.contentStyles}>
                        {!!this.plTree.$scopedSlots.default ?
                            this.plTree.$scopedSlots.default(this.treeNode)
                            :
                            (!!this.plTree.renderContent ?
                                this.plTree.renderContent(h, this.treeNode)
                                :
                                [
                                    !this.plTree.nodeIcon ? null : <pl-icon icon={this.plTree.nodeIcon(this.treeNode)}/>,
                                    <span class="pl-tree-node-label">{this.treeNode.label}</span>
                                ])
                        }
                    </div>
                </div>
            </pl-item>
        )
    },
    computed: {
        ...OldTreeNode.computed,
    },
}