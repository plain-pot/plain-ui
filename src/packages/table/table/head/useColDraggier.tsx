import {$plain} from "@/packages/base";
import {StyleType} from "@/types/utils";
import {PlcType} from "@/packages/table/plc/plc";
import {PlainTable} from "@/packages/table/table/table";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";

interface DragData {
    left: number
    width: number
    plc: PlcType | PlcGroupType
    droppable: boolean
}

enum HoverPart {
    left = 'left',
    right = 'right',
}

/**
 * 获取可以滚动的父组件
 * @author  韦胜健
 * @date    2020/8/19 23:50
 */
export function getHorizontalScrollParent(el: HTMLElement): HTMLElement {
    while (!!el && el.scrollWidth <= el.offsetWidth) {
        el = el.parentElement!
    }
    return el
}

/**
 * 递归遍历plc数组数据
 * @author  韦胜健
 * @date    2020/9/6 11:24
 */
function iteratePlc(plcList: (PlcType | PlcGroupType)[], handler: (plc: PlcType | PlcGroupType) => 'stop' | void): void {

    for (let i = 0; i < plcList.length; i++) {
        const item = plcList[i]
        const flag = handler(item)
        if (flag === 'stop') {
            return
        } else {
            if (isPlcGroup(item)) {
                iteratePlc(item.items.value, handler)
            }
        }
    }

}

/**
 * 或者plc对象的兄弟节点
 * @author  韦胜健
 * @date    2020/9/6 11:24
 */
function getBroPlcList(plcList: (PlcType | PlcGroupType)[], plc: PlcType | PlcGroupType): (PlcType | PlcGroupType)[] {

    let broPlcList: (PlcType | PlcGroupType)[] = []

    if (plcList.indexOf(plc) > -1) {
        broPlcList = plcList
    } else {
        iteratePlc(plcList, itarPlc => {
            if (isPlcGroup(itarPlc)) {
                if (itarPlc.items.value.indexOf(plc) > -1) {
                    broPlcList = itarPlc.items.value
                    return 'stop'
                }
            }
        })
    }

    if (broPlcList.length === 0) {
        /*内部错误，找不到兄弟节点*/
        throw new Error('Internal error! sibling node not found.')
    }

    return broPlcList
}

/**
 * 获取plc的宽度
 * @author  韦胜健
 * @date    2020/9/6 12:09
 */
function getPlcWidth(plc: PlcType | PlcGroupType) {
    if (!isPlcGroup(plc)) {
        return Number(plc.props.width)
    } else {
        return plc.items.value.reduce((ret: number, item: PlcType | PlcGroupType) => {
            ret += getPlcWidth(item)
            return ret
        }, 0)
    }
}

/**
 * 获取plc的高度，如果是plc，则高度为currentTarget的高度，如果是plcGroup，则高度等于所有后代层数乘以currentTarget的高度
 * @author  韦胜健
 * @date    2020/9/6 11:29
 */
function getIndicatorHeight(
    plc: PlcType | PlcGroupType,
    table: PlainTable,
) {
    if (isPlcGroup(plc)) {
        return (table.plcData.value!.maxLevel - plc.level!) * table.propsState.headRowHeight
    } else {
        return plc.rowspan! * table.propsState.headRowHeight
    }

}

/**
 * 获取plcList中最底层的plc
 * @author  韦胜健
 * @date    2020/9/6 20:27
 */
function getLowestPlcList(plcList: (PlcType | PlcGroupType)[]): PlcType[] {

    return plcList.reduce((ret: PlcType[], plc: PlcType | PlcGroupType) => {
        if (isPlcGroup(plc)) {
            ret.push(...getLowestPlcList(plc.items.value as (PlcType | PlcGroupType)[]))
        } else {
            ret.push(plc)
        }
        return ret
    }, [] as PlcType[])

}

/**
 * 获取拖拽所需要的数据
 * @author  韦胜健
 * @date    2020/9/6 20:41
 */
function getDragData(table: PlainTable, plc: PlcType | PlcGroupType): DragData[] {

    const plcList = table.plcData.value!.plcList
    const broList = getBroPlcList(plcList, plc)

    const broLowestList = getLowestPlcList(broList)
    const allLowestList = getLowestPlcList(plcList) as (PlcType | PlcGroupType)[]

    allLowestList.splice(allLowestList.indexOf(broLowestList[0]), broLowestList.length, ...broList)

    const broData: DragData[] = []
    let left = 0

    allLowestList.forEach(plc => {
        const item = {
            left,
            width: getPlcWidth(plc),
            plc,
            droppable: broList.indexOf(plc) > -1
        }
        left += item.width
        broData.push(item)
    })

    // broData.forEach(bro => console.log(bro.plc.props.title, bro.left, bro.droppable))

    return broData

}

export function useColDraggier(option: {
    colDraggable: boolean,
    plc: () => PlcType,
    table: PlainTable,
}) {

    if (!option.colDraggable) {
        return {}
    }

    const indicatorSize = 3

    const state = {
        startClientX: 0,
        moveClientX: 0,

        startScrollLeft: 0,
        moveScrollLeft: 0,

        scrollParent: null as null | HTMLElement,
        currentRect: {
            top: 0,
            left: 0,
            height: 0,
            width: 0,
        },
        scrollRect: {
            top: 0,
            left: 0,
            height: 0,
            width: 0,
        },
        indicator: null as null | HTMLElement,
        dragData: null as null | DragData[],
    }

    const utils = {
        getDragData: (left: number): { index: number, dragData: DragData, hover: HoverPart } => {
            for (let i = 0; i < state.dragData!.length; i++) {
                const dd = state.dragData![i];
                if (left >= dd.left && left <= dd.left + dd.width) {
                    return {
                        index: i,
                        dragData: dd,
                        hover: left - dd.left > dd.width / 2 ? HoverPart.right : HoverPart.left
                    }
                }
            }
            throw new Error(`Can not get dragData by left:${left}`)
        },
        refresh() {
            const left = (state.moveClientX - state.scrollRect.left) + (state.moveScrollLeft)
            const {index, dragData, hover} = utils.getDragData(left)

            let indicatorLeft = (hover === HoverPart.left ? dragData.left : dragData.left + dragData.width - indicatorSize) + state.scrollRect.left - state.moveScrollLeft
            indicatorLeft = Math.min(Math.max(state.scrollRect.left, indicatorLeft), state.scrollRect.left + state.scrollRect.width - indicatorSize)

            Object.assign(state.indicator!.style, {
                left: `${indicatorLeft}px`,
            } as StyleType)

            state.indicator!.setAttribute('droppable', dragData.droppable ? 'true' : 'false')
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            const plc = option.plc()
            state.dragData = getDragData(option.table, plc)

            const currentTarget = e.currentTarget as HTMLElement
            state.currentRect = currentTarget.getBoundingClientRect()!
            const indicatorHeight = getIndicatorHeight(plc, option.table)

            state.startClientX = state.moveClientX = e.clientX
            state.scrollParent = getHorizontalScrollParent(currentTarget)
            state.scrollRect = state.scrollParent.parentElement!.getBoundingClientRect()
            state.startScrollLeft = state.moveScrollLeft = state.scrollParent.scrollLeft

            state.indicator = document.createElement('div')
            $plain.utils.addClass(state.indicator, 'plt-col-draggier-indicator')
            Object.assign(state.indicator.style, {
                top: `${state.currentRect.top}px`,
                left: `${state.currentRect.left}px`,
                height: `${indicatorHeight}px`,
                width: `${indicatorSize}px`,
                position: 'fixed',
                zIndex: `${$plain.nextIndex()}`,
            } as StyleType)
            document.body.appendChild(state.indicator)

            $plain.disableSelect()
            document.addEventListener('mouseup', handler.mouseup)
            state.scrollParent!.addEventListener('mousemove', handler.mousemove)
            state.scrollParent!.addEventListener('scroll', handler.scroll)

            utils.refresh()
        },
        mousemove: (e: MouseEvent) => {
            state.moveClientX = e.clientX
            utils.refresh()
        },
        scroll: () => {
            state.moveScrollLeft = state.scrollParent!.scrollLeft
            utils.refresh()
        },
        mouseup: () => {
            $plain.enableSelect()
            document.removeEventListener('mouseup', handler.mouseup)
            state.scrollParent!.removeEventListener('mousemove', handler.mousemove)
            state.scrollParent!.removeEventListener('scroll', handler.scroll)
            if (!!state.indicator) {
                state.indicator.parentNode!.removeChild(state.indicator)
                state.indicator = null
            }
        }
    }

    const on = {
        mousedown: handler.mousedown,
    }

    return {
        tdBinding: {
            on,
        },
    }

}