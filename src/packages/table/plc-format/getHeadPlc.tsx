/**
 * 对plc设置标记，是否为最后一个左固定列，是否为第一个右固定列
 * @author  韦胜健
 * @date    2020/8/15 23:06
 */
import {TablePlc} from "../plc-core/plc.type";
import {TablePlcFixedType} from "../plc-core/plc.utils";

function setFixedFlag(plcList: TablePlc[]) {
    let lastFixedLeft: TablePlc | undefined;
    let firstFixedRight: TablePlc | undefined;

    plcList.forEach(plc => {
        if (plc.props.fixed === TablePlcFixedType.left) {
            lastFixedLeft = plc
        }
        if (!firstFixedRight && plc.props.fixed === TablePlcFixedType.right) {
            firstFixedRight = plc
        }
    })

    function setLastFixedLeft(plc: TablePlc) {
        plc.isLastFixedLeft = true
        if (plc.group) {
            setLastFixedLeft(plc.children[plc.children.length - 1])
        }
    }

    !!lastFixedLeft && setLastFixedLeft(lastFixedLeft);

    function setFirstFixedRight(plc: TablePlc) {
        plc.isFirstFixedRight = true
        if (plc.group) {
            setFirstFixedRight(plc.children[0])
        }
    }

    !!firstFixedRight && setFirstFixedRight(firstFixedRight)
}

/**
 * 计算渲染表头所需要的的plc二维数组
 * @author  韦胜健
 * @date    2020/8/15 19:27
 */
export function getHeadPlc(plcList: TablePlc[]) {
    // 最大表头层数
    let maxLevel = 1

    // 计算最大层数
    const calculateLevel = (list: TablePlc[] | null, level: number) => {
        if (!!list && list.length > 0) {
            if (level > maxLevel) maxLevel = level
            list.forEach((item) => {
                item.level = level - 1
                if (item.group) {
                    calculateLevel((item).children, level + 1)
                }
            })
        }
    }
    calculateLevel(plcList, 1)

    // 计算多级表头每个单元格所占行数以及列数
    const calculateSpan = (item: TablePlc) => {
        if (item.group) {
            const group = item
            group.children.forEach(calculateSpan)
            group.rowspan = 1
            group.colspan = 0
            group.children.forEach(i => group.colspan! += i.colspan!)
        } else {
            const plc = item
            plc.rowspan = maxLevel - plc.level!
            plc.colspan = 1
        }
    }
    plcList.forEach(plc => calculateSpan(plc))

    // 计算结果
    const headCols: TablePlc[][] = []

    for (let j = 0; j < maxLevel; j++) headCols.push([])
    // 收集多级表头渲染数据
    const calculateHeadColumns = (list: TablePlc[]) => {
        if (!!list && list.length > 0) {
            list.forEach((item) => {
                headCols[item.level!].push(item)
                if (item.group) {
                    calculateHeadColumns((item).children)
                }
            })
        }
    }
    calculateHeadColumns(plcList)

    setFixedFlag(headCols[0])

    return {
        headCols,
        maxLevel,
    }
}