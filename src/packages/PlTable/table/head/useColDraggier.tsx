import {tPlc, tPlcType} from "../../plc/utils/plc.type";
import {addClass} from "plain-utils/dom/addClass";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import PlTable from "../../index";
import {PlainScroll} from "../../../PlScroll";
import {useAutoScroll} from "../../../PlScroll/useAutoScroll";
import {ComputedRef, StyleProperties} from "plain-ui-composition"
import {nextIndex} from "plain-ui-composition"


interface DragData {
    left: number
    width: number
    plc: tPlcType
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
function iteratePlc(plcList: tPlcType[], handler: (plc: tPlcType) => 'stop' | void): void {

    for (let i = 0; i < plcList.length; i++) {
        const item = plcList[i]
        const flag = handler(item)
        if (flag === 'stop') {
            return
        } else {
            if (item.group) {
                iteratePlc(item.children, handler)
            }
        }
    }

}

/**
 * 或者plc对象的兄弟节点
 * @author  韦胜健
 * @date    2020/9/6 11:24
 */
function getBroPlcList(plcList: tPlcType[], plc: tPlcType): tPlcType[] {

    let broPlcList: tPlcType[] = []

    if (plcList.indexOf(plc) > -1) {
        broPlcList = plcList
    } else {
        iteratePlc(plcList, itarPlc => {
            if (itarPlc.group) {
                if (itarPlc.children.indexOf(plc) > -1) {
                    broPlcList = itarPlc.children
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
function getPlcWidth(plc: tPlcType) {
    if (!plc.group) {
        return Number(plc.props.width)
    } else {
        return plc.children.reduce((ret: number, item: tPlcType) => {
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
    plc: tPlcType,
    table: typeof PlTable.use.class,
) {
    if (plc.group) {
        return (table.plcData.value!.maxLevel - plc.level!) * table.numberState.headRowHeight
    } else {
        return plc.rowspan! * table.numberState.headRowHeight
    }

}

/**
 * 获取plcList中最底层的plc
 * @author  韦胜健
 * @date    2020/9/6 20:27
 */
function getLowestPlcList(plcList: tPlcType[]): tPlc[] {

    return plcList.reduce((ret: tPlc[], plc: tPlcType) => {
        if (plc.group) {
            ret.push(...getLowestPlcList(plc.children))
        } else {
            ret.push(plc)
        }
        return ret
    }, [] as tPlc[])

}

/**
 * 获取拖拽所需要的数据
 * @author  韦胜健
 * @date    2020/9/6 20:41
 */
function getDragData(table: typeof PlTable.use.class, plc: tPlcType): {
    broData: DragData[],
    broList: tPlcType[]
} {

    const plcList = table.plcData.value!.plcList
    const broList = getBroPlcList(plcList, plc)

    const broLowestList = getLowestPlcList(broList)
    const allLowestList = getLowestPlcList(plcList) as tPlcType[]

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

    return {
        broList,
        broData,
    }

}

export function useColDraggier(config: ComputedRef<{
    plc: tPlcType,
    table: typeof PlTable.use.class,
    scrollRefer: () => PlainScroll,
}>) {

    const isDraggable = !!config.value.table.props.colDraggable && config.value.plc.props.colDraggable !== false
    if (!isDraggable) {return {tdAttrs: {}}}
    const autoScroller = useAutoScroll({
        vertical: false,
        getScroll: config.value.scrollRefer,
    })
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
        broList: null as null | tPlcType[],
        refreshData: null as null | {
            index: number,
            dragData: DragData,
            hover: HoverPart,
        }
    }

    const utils = {
        getDragData: (left: number): { index: number, dragData: DragData, hover: HoverPart } => {
            for (let i = 0; i < state.dragData!.length; i++) {
                const dd = state.dragData![i];
                if (left >= dd.left && left <= dd.left + (dd.width || Infinity)) {
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
            state.refreshData = utils.getDragData(left)
            const {dragData, hover} = state.refreshData

            let indicatorLeft = (hover === HoverPart.left ? dragData.left : dragData.left + dragData.width - indicatorSize) + state.scrollRect.left - state.moveScrollLeft
            indicatorLeft = Math.min(Math.max(state.scrollRect.left, indicatorLeft), state.scrollRect.left + state.scrollRect.width - indicatorSize)

            Object.assign(state.indicator!.style, {
                left: `${indicatorLeft}px`,
            } as StyleProperties)

            state.indicator!.setAttribute('droppable', dragData.droppable ? 'true' : 'false')
        },
    }

    const handler = {
        mousedown: (e: MouseEvent) => {
            if (e.button === 2) {return}

            const {broList, broData} = getDragData(config.value.table, config.value.plc)
            state.dragData = broData
            state.broList = broList

            const currentTarget = e.currentTarget as HTMLElement
            state.currentRect = currentTarget.getBoundingClientRect()!
            const indicatorHeight = getIndicatorHeight(config.value.plc, config.value.table)

            state.startClientX = state.moveClientX = e.clientX
            state.scrollParent = getHorizontalScrollParent(currentTarget)
            state.scrollRect = state.scrollParent.parentElement!.getBoundingClientRect()
            state.startScrollLeft = state.moveScrollLeft = state.scrollParent.scrollLeft

            state.indicator = document.createElement('div')
            addClass(state.indicator, 'plt-col-draggier-indicator')
            Object.assign(state.indicator.style, {
                top: `${state.currentRect.top}px`,
                left: `${state.currentRect.left}px`,
                height: `${indicatorHeight}px`,
                width: `${indicatorSize}px`,
                position: 'fixed',
                zIndex: `${nextIndex() + 100}`,  // 加100是为了不被 autoScroller 遮住；
                pointerEvents: 'none',                  // indicator只是一个指示的作用，这里设置none为了不挡住autoScroller的鼠标事件
            } as StyleProperties)
            document.body.appendChild(state.indicator)

            disabledUserSelect()
            document.addEventListener('mouseup', handler.mouseup)
            state.scrollParent!.addEventListener('mousemove', handler.mousemove)
            state.scrollParent!.addEventListener('scroll', handler.scroll)

            utils.refresh()
            autoScroller.showHover()
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

            (() => {
                if (!state.refreshData) {
                    return
                }
                const {dragData, hover} = state.refreshData

                if (!dragData.droppable) {
                    return;
                }

                const startPlc = config.value.plc
                const endPlc = dragData.plc
                const broList = state.broList!

                const startIndex = broList.indexOf(startPlc)
                let endIndex = broList.indexOf(endPlc)
                if (startIndex === endIndex) {
                    return;
                }

                if (startPlc.props.fixed != endPlc.props.fixed) {
                    startPlc.setPropsState({fixed: endPlc.props.fixed})
                }

                broList.splice(startIndex, 1)
                endIndex = broList.indexOf(endPlc)
                endIndex = hover === HoverPart.right ? endIndex + 1 : endIndex
                broList.splice(endIndex, 0, startPlc)

                broList.forEach((plc, index) => plc.setPropsState({order: index}))
            })();

            enableUserSelect()
            document.removeEventListener('mouseup', handler.mouseup)
            state.scrollParent!.removeEventListener('mousemove', handler.mousemove)
            state.scrollParent!.removeEventListener('scroll', handler.scroll)
            if (!!state.indicator) {
                state.indicator.parentNode!.removeChild(state.indicator)
                state.indicator = null
            }
            autoScroller.hideHover()
        }
    }

    return {
        tdAttrs: {onMousedown: handler.mousedown,}
    }
}
