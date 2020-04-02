export default {
    props: {
        treeNode: {type: Object},
    },
    data() {
        return {}
    },
    render(h) {
        return (
            <li class="pl-virtual-tree-node">
                {this.treeNode.label}
            </li>
        )
    },
}