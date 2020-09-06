import {$plain} from "@/packages/base";
import {StyleType} from "@/types/utils";
import {PlcType} from "@/packages/table/plc/plc";
import {PlainTable} from "@/packages/table/table/table";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";

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
function getBroPlcList(table: PlainTable, plc: PlcType | PlcGroupType): null | (PlcType | PlcGroupType)[] {

    const plcList = table.plcData.value!.plcList
    let broPlcList: null | (PlcType | PlcGroupType)[] = null

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

interface DragData {
    left: number
    width: number
    plc: PlcType | PlcGroupType
}

function getDragData(table: PlainTable, plc: PlcType | PlcGroupType) {

    const broPlcList = getBroPlcList(table, plc)
    if (!broPlcList) {
        /*内部错误，找不到兄弟节点*/
        throw new Error('Internal error! sibling node not found.')
    }

    const ret: DragData[] = []
    let left = 0

    broPlcList.forEach(plc => {
        const item = {
            left,
            width: getPlcWidth(plc),
            plc,
        }
        left += item.width
        ret.push(item)
    })
    return ret

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
        refresh() {
            const left = state.moveClientX - state.scrollRect.left + (state.moveScrollLeft - state.startScrollLeft)
            console.log('left', left)
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
            Object.assign(state.indicator.style, {
                top: `${state.currentRect.top}px`,
                left: `${state.currentRect.left}px`,
                height: `${indicatorHeight}px`,
                width: `${indicatorSize}px`,
                backgroundColor: '#12b4a5',
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