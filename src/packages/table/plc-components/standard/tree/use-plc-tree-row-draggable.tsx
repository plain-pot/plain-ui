/**
 * 树列拖拽排序
 * @author  韦胜健
 * @date    2020/8/24 9:38
 */
import {computed, reactive, Ref, watch} from "@vue/composition-api";
import {getRowEl, getScrollParent} from "@/packages/table/plc-components/standard/draggier/composition/utils";
import {TableNode} from "@/packages/table/table/TableNode";
import {$plain} from "@/packages/base";
import {TreeDropType} from "@/packages/tree/utils/tree-constant";

/**
 * 拖拽的过程中，在目标行移动时，应该放置的行为
 * @author  韦胜健
 * @date    2020/8/25 16:29
 */
enum DropType {
    prev = 'prev',                          // 将拖拽节点作为目标节点的兄节点放置在目标节点前面
    inner = 'inner',                        // 将拖拽节点作为目标节点的子节点添加到目标节点的儿子节点中
    next = 'next'                           // 将拖拽节点作为目标节点的弟节点，放置在目标节点后面
}

const indicatorSize = 3;

/**
 * 获取目标节点所有父节点
 * @author  韦胜健
 * @date    2020/8/25 16:33
 */
function getParents(node: TableNode | null) {
    const parents = [] as TableNode[]
    while (!!node && node.level > 0) {
        parents.push(node)
        node = node.parent
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

    const state = {

        startNode: null as null | TableNode,
        moveNode: null as null | TableNode,

        startScrollTop: 0,
        moveScrollTop: 0,

        startClientY: 0,
        moveClientY: 0,

        rowHeight: 0,
        scrollParent: null as null | HTMLElement,
        rowEl: null as null | HTMLElement,
        scrollParentRect: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        },
        indicator: null as null | HTMLElement,
    }

    const utils = {
        disabledDrop() {
            state.indicator!.style.opacity = '0'
        },
        enableDrop: (targetIndex: number, dropType: DropType) => {

            let top = targetIndex * state.rowHeight + state.scrollParentRect.top - (state.moveScrollTop - state.startScrollTop)

            switch (dropType) {
                case DropType.prev:
                    state.indicator!.style.top = `${top}px`
                    state.indicator!.style.height = `${indicatorSize}px`
                    state.indicator!.style.opacity = '1'
                    break
                case DropType.inner:
                    state.indicator!.style.top = `${top}px`
                    state.indicator!.style.height = `${state.rowHeight}px`
                    state.indicator!.style.opacity = '0.15'
                    break
                case DropType.next:
                    state.indicator!.style.top = `${top + state.rowHeight - indicatorSize}px`
                    state.indicator!.style.height = `${indicatorSize}px`
                    state.indicator!.style.opacity = '1'
                    break
            }
        },
        refresh() {
            const top = state.startClientY - state.scrollParentRect.top + (state.moveScrollTop - state.startScrollTop) + (state.moveClientY - state.startClientY)
            let targetIndex = top / state.rowHeight
            const external = targetIndex % 1
            targetIndex = Math.floor(targetIndex)
            const dropType: DropType = external < 0.3 ? DropType.prev :
                external > 0.7 ? DropType.next : DropType.inner

            state.moveNode = flatDataList.value[targetIndex]
            const parents = getParents(state.moveNode)

            if (parents.indexOf(state.startNode!) > -1) {
                return utils.disabledDrop()
            }

            return utils.enableDrop(targetIndex, dropType)
        },
    }

    const handler = {
        mousedown: (e: DragEvent) => {
            state.startClientY = state.moveClientY = e.clientY

            state.rowEl = getRowEl(e, rowClass)
            state.rowHeight = state.rowEl.offsetHeight
            const vid = Number(state.rowEl.getAttribute('vid'))
            state.moveNode = state.startNode = flatDataList.value[vid]

            state.scrollParent = getScrollParent(state.rowEl)
            state.startScrollTop = state.moveScrollTop = state.scrollParent.scrollTop
            const {top, left, height, width} = (state.scrollParent.parentNode as HTMLElement).getBoundingClientRect()
            state.scrollParentRect = {top, left, height, width}

            state.indicator = document.createElement('div')
            state.indicator.style.position = 'fixed'
            state.indicator.style.pointerEvents = 'none'
            state.indicator.style.height = `${indicatorSize}px`
            state.indicator.style.width = `${state.scrollParentRect.width}px`
            state.indicator.style.left = `${state.scrollParentRect.left}px`
            state.indicator.style.backgroundColor = '#12b4a5'
            document.body.appendChild(state.indicator)

            state.scrollParent.addEventListener('scroll', handler.scroll)
            document.addEventListener('mousemove', handler.mousemove)
            document.addEventListener('mouseup', handler.mouseup)
        },
        scroll() {
            state.moveScrollTop = state.scrollParent!.scrollTop
            utils.refresh()
        },
        /**
         * 在dragover中判断clientX以及clientY，如果这两个值没有变化，就不往下执行，节省性能
         * @author  韦胜健
         * @date    2020/8/25 22:22
         */
        mousemove: (e: MouseEvent) => {
            const {top, height} = state.scrollParentRect
            if (e.clientY < top || e.clientY > top + height) {
                return;
            }
            state.moveClientY = e.clientY
            utils.refresh()
        },
        mouseup: (e: MouseEvent) => {
            console.log('mouseup', e)
        }
    }

    return {
        handler,
    }
}