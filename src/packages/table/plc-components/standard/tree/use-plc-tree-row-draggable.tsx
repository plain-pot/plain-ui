/**
 * 树列拖拽排序
 * @author  韦胜健
 * @date    2020/8/24 9:38
 */
import {computed, reactive, Ref, watch} from "@vue/composition-api";
import {getRowEl, getScrollParent} from "@/packages/table/plc-components/standard/draggier/composition/utils";
import {TableNode} from "@/packages/table/table/TableNode";
import {$plain} from "@/packages/base";

/**
 * 拖拽的过程中，在目标行移动时，应该放置的行为
 * @author  韦胜健
 * @date    2020/8/25 16:29
 */
enum HoverPart {
    prev = 'prev',                          // 将拖拽节点作为目标节点的兄节点放置在目标节点前面
    inner = 'inner',                        // 将拖拽节点作为目标节点的子节点添加到目标节点的儿子节点中
    next = 'next'                           // 将拖拽节点作为目标节点的弟节点，放置在目标节点后面
}

/**
 * 拖拽过程中，鼠标的显示状态
 * @author  韦胜健
 * @date    2020/8/25 16:29
 */
enum DragCursor {
    none = 'none',                          // 默认状态，当前处于非拖拽的状态
    move = 'plain-drag-move',               // 当前处于拖拽状态，并且当前可以将拖拽节点放置在目标节点中
    notAllowed = 'plain-drag-not-allowed'   // 当前处于拖拽状态，但是当前不可以将拖拽节点放置在目标节点中
}

/**
 * 获取目标节点所有父节点
 * @author  韦胜健
 * @date    2020/8/25 16:33
 */
function getParents(node: TableNode) {
    let parent = node.parent
    const parents = [] as TableNode[]
    while (!!parent && parent.level > 0) {
        parents.push(parent)
        parent = parent.parent
    }
    return parents
}

export function usePlcTreeRowDraggable(
    {
        rowDraggable,
        rowClass,
        flatDataList,
    }: {
        rowDraggable: boolean | undefined,
        rowClass: string,
        flatDataList: Readonly<Ref<readonly TableNode[]>>,
    }) {

    const handler = {
        dragstart: (e: DragEvent) => {
            e.stopPropagation()
            e.dataTransfer!.effectAllowed = 'move'

            const rowEl = getRowEl(e, rowClass)
            document.addEventListener('dragover', handler.dragover)
            document.addEventListener('dragend', () => {
                console.log('dragend')
            })
        },
        /**
         * 在dragover中判断clientX以及clientY，如果这两个值没有变化，就不往下执行，节省性能
         * @author  韦胜健
         * @date    2020/8/25 22:22
         */
        dragover: (e) => {
            console.log('drag', e.dataTransfer!.dropEffect)
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer!.dropEffect = 'move'
        },
    }

    return {
        handler,
    }
}