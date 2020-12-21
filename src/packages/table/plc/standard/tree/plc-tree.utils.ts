import {TableNode} from "../../../core/useTableNode";

export const TableTreeUtils = {
    iterate: (
        {
            nodes,
            handler,
            iterateChildren,
            iterateChildrenFirst,
        }: {
            nodes?: TableNode[],
            handler: (node: TableNode) => void,
            iterateChildren?: (node: TableNode) => boolean,
            iterateChildrenFirst?: boolean,
        }
    ) => {
        if (!nodes) return
        nodes.forEach(node => {
            !iterateChildrenFirst && handler(node);
            if (!!node.children && (!iterateChildren || iterateChildren(node))) {
                TableTreeUtils.iterate({
                    nodes: node.children,
                    handler,
                    iterateChildren,
                    iterateChildrenFirst,
                })
            }
            iterateChildrenFirst && handler(node);
        })
    },
}