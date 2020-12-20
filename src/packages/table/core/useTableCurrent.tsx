import {reactive} from 'vue'
import {TableNode} from "./useTableNode";
import {hasClass} from "plain-utils/dom/hasClass";

export function useTableCurrent(
    {
        nodeState,
        emit,
    }: {
        nodeState: { nodeMap: { [k: string]: TableNode } },
        emit: {
            onClickRow: (node: TableNode, e: MouseEvent) => void,
            onDblclickRow: (node: TableNode, e: MouseEvent) => void,
            onClickCell: (node: TableNode, e: MouseEvent) => void,
            onDblclickCell: (node: TableNode, e: MouseEvent) => void,
        },
    }
) {

    const state = reactive({
        current: null as null | TableNode,
    })
    const methods = {
        setCurrent: (keyOrNode: string | TableNode) => state.current = typeof keyOrNode === "object" ? keyOrNode : nodeState.nodeMap[keyOrNode],
        getCurrent: () => state.current,
    }
    return {
        state,
        methods,
        onClickRow: (e: MouseEvent, node: TableNode) => {
            methods.setCurrent(node);
            emit.onClickRow(node, e);
            hasClass(e.target as HTMLElement, 'plt-cell') && emit.onClickCell(node, e);
        },
        onDblclickRow: (e: MouseEvent, node: TableNode) => {
            emit.onDblclickRow(node, e)
            hasClass(e.target as HTMLElement, 'plt-cell') && emit.onDblclickCell(node, e);
        }
    }
}