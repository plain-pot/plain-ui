export default {
    props: {
        treeNode: {type: Object},
    },
    data() {
        return {}
    },
    render(h) {
        return (
            <pl-item class="pl-virtual-tree-node" tag="li" block>
                {this.treeNode.label}
            </pl-item>
        )
    },
}