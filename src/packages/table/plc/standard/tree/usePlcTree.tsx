import {injectPlainTable} from "../../../table";
import {computed} from 'vue';
import {TableNode} from "../../../core/useTableNode";
import {TableTreeUtils} from "./plc-tree.utils";

export function usePlcTree() {
    const {nodeState} = injectPlainTable()

    const expandNodes = computed((): TableNode[] => {
        if (!nodeState.root) {
            return []
        }
        let nodes: TableNode[] = []
        TableTreeUtils.iterate({
            nodes: nodeState.root.children,
            handler: node => node.expand && nodes.push(node)
        })
        return nodes
    })
    const checkNodes = computed((): TableNode[] => {
        if (!nodeState.root) {
            return []
        }
        let nodes: TableNode[] = []
        TableTreeUtils.iterate({
            nodes: nodeState.root.children,
            handler: node => node.check && nodes.push(node)
        })
        return nodes
    })

    const expandKeys = computed(() => expandNodes.value.map(node => node.key))
    const checkKeys = computed(() => checkNodes.value.map(node => node.key))


}