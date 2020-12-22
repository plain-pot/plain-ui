import {reactive} from 'vue'
import {TableNode} from "./useTableNode";
import {hasClass} from "plain-utils/dom/hasClass";

export function useTableCurrent(
    {
        emit,
        methods,
    }: {
        methods: {
            setCurrent: (key: string) => void,
        },
        emit: {
            onClickRow: (node: TableNode, e: MouseEvent) => void,
            onDblclickRow: (node: TableNode, e: MouseEvent) => void,
            onClickCell: (node: TableNode, e: MouseEvent) => void,
            onDblclickCell: (node: TableNode, e: MouseEvent) => void,
        },
    }
) {
    return {
        methods,
        onClickRow: (e: MouseEvent, node: TableNode) => {
            methods.setCurrent(node.key);
            emit.onClickRow(node, e);
            hasClass(e.target as HTMLElement, 'plt-cell') && emit.onClickCell(node, e);
        },
        onDblclickRow: (e: MouseEvent, node: TableNode) => {
            emit.onDblclickRow(node, e)
            hasClass(e.target as HTMLElement, 'plt-cell') && emit.onDblclickCell(node, e);
        }
    }
}