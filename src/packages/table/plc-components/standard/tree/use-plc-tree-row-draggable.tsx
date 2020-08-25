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
    default = 'plain-drag-default',                    // 默认状态，当前处于非拖拽的状态
    move = 'plain-drag-move',                          // 当前处于拖拽状态，并且当前可以将拖拽节点放置在目标节点中
    notAllowed = 'plain-drag-not-allowed'              // 当前处于拖拽状态，但是当前不可以将拖拽节点放置在目标节点中
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

    /**
     * 非响应式属性（状态）
     * @author  韦胜健
     * @date    2020/8/24 22:26
     */
    const normalState = {
        rowHeight: 0,
        dragStartClientY: 0,
        dragMoveClientY: 0,

        dragStartScrollTop: 0,
        dragMoveScrollTop: 0,

        dragEl: null as null | HTMLElement,
        scrollParent: null as null | HTMLElement,

        scrollParentRect: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        }
    }

    /**
     * 响应式属性（状态）
     * @author  韦胜健
     * @date    2020/8/24 22:26
     */
    const reactiveState = reactive({
        dragStartIndex: null as null | number,
        dragMoveIndex: null as null | number,
        dragMovePart: null as null | HoverPart,
    })

    const utils = {
        refresh: () => {
            console.log('refresh')
            const {dragStartClientY, dragMoveClientY, dragStartScrollTop, dragMoveScrollTop, scrollParentRect: {top, left}} = normalState
            const mouseTop = dragMoveClientY - top + (dragMoveScrollTop - dragStartScrollTop)

            let hoverIndex = Math.floor(mouseTop / normalState.rowHeight)
            hoverIndex = Math.min(Math.max(0, hoverIndex), flatDataList.value.length - 1)

            const external = mouseTop % normalState.rowHeight
            let part: HoverPart = external < normalState.rowHeight * (1 / 3) ? HoverPart.prev :
                external > normalState.rowHeight * (2 / 3) ? HoverPart.next : HoverPart.inner

            reactiveState.dragMoveIndex = hoverIndex
            reactiveState.dragMovePart = part
        }
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            normalState.dragStartClientY = normalState.dragMoveClientY = e.clientY
            normalState.dragEl = getRowEl(e, rowClass)
            normalState.rowHeight = normalState.dragEl.offsetHeight
            const vid = Number(normalState.dragEl.getAttribute('vid'))
            reactiveState.dragStartIndex = vid
            normalState.scrollParent = getScrollParent(normalState.dragEl)
            normalState.dragStartScrollTop = normalState.scrollParent.scrollTop
            normalState.dragMoveScrollTop = normalState.scrollParent.scrollTop
            const {height, width, left, top} = normalState.scrollParent.getBoundingClientRect()!
            normalState.scrollParentRect = {height, width, left, top}

            normalState.scrollParent.parentNode!.addEventListener('mousemove', handler.mousemove as any)
            normalState.scrollParent.addEventListener('scroll', handler.scroll)
            document.addEventListener('mouseup', handler.mouseup)

            utils.refresh()
        },
        scroll: () => {
            normalState.dragMoveScrollTop = normalState.scrollParent!.scrollTop
            utils.refresh()
        },
        mousemove: (e: MouseEvent) => {
            normalState.dragMoveClientY = e.clientY
            utils.refresh()
        },
        mouseup: () => {

            normalState.scrollParent!.parentNode!.removeEventListener('mousemove', handler.mousemove as any)
            normalState.scrollParent!.removeEventListener('scroll', handler.scroll)
            document.removeEventListener('mouseup', handler.mouseup)

        }
    }

    const dragState = computed(() => {

        console.log('dragState')

        const result = {
            cursor: DragCursor.default,                                 // 当前鼠标应该显示的状态
            droppable: false,                                           // 当前是否可放置
        }

        if (!reactiveState.dragStartIndex) {
            // 没有dragStartIndex表示当前不处于拖拽状态
            result.cursor = DragCursor.default
            result.droppable = false
            return result
        }
        const dragStartTableNode = flatDataList.value[reactiveState.dragStartIndex]
        const dragMoveTableNode = flatDataList.value[reactiveState.dragMoveIndex!]

        // 不可以将某一个节点放置在他的子节点中
        const moveNodeParents = getParents(dragMoveTableNode)
        if (moveNodeParents.indexOf(dragStartTableNode) > -1) {
            result.cursor = DragCursor.notAllowed
            result.droppable = false
        }

        return result

    })

    watch(() => dragState.value.cursor, (val: DragCursor, oldVal: DragCursor) => {
        console.log('watch')
        switch (val) {
            case DragCursor.default:
                if (oldVal !== DragCursor.default) {
                    $plain.utils.removeClass(document.body, oldVal)
                }
                break
            case DragCursor.move:
                if (oldVal === DragCursor.notAllowed) {
                    $plain.utils.removeClass(document.body, oldVal)
                }
                $plain.utils.addClass(document.body, val)
                break
            case DragCursor.notAllowed:
                if (oldVal === DragCursor.move) {
                    $plain.utils.removeClass(document.body, oldVal)
                }
                $plain.utils.addClass(document.body, val)
                break
        }
    })

    return {
        utils,
        handler,
    }
}