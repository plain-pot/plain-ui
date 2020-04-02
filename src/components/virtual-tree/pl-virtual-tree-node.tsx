import PlTreeNode from '../tree/pl-tree-node.vue'

export default {
    name: 'pl-virtual-tree-node',
    mixins: [PlTreeNode],
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
                {this.getTreeNodeWrapper(h)}
            </pl-item>
        )
    },
}