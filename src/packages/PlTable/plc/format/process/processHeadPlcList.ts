import {tPlcType} from "../../utils/plc.type";
import {TablePlcFixedType} from "../../../table/utils/table.utils";

/**
 * 计算渲染表头所需要的二维数组以及层数
 * @author  韦胜健
 * @date    2020/12/18 14:38
 */
export function processHeadPlcList({plcList}: { plcList: tPlcType[] }) {
    // 最大表头层数
    let maxLevel = 1
    // 计算最大层数
    const calculateLevel = (list: tPlcType[] | null, level: number) => {
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
    const calculateSpan = (item: tPlcType) => {
        if (item.group) {
            const group = item
            group.children.forEach(calculateSpan)
            group.rowspan = 1
            group.colspan = 0
            group.children.forEach(i => group.colspan += i.colspan)
        } else {
            const plc = item
            plc.rowspan = maxLevel - plc.level
            plc.colspan = 1
        }
    }
    plcList.forEach(plc => calculateSpan(plc))

    // 计算结果
    const headPlcListArray: tPlcType[][] = []

    for (let j = 0; j < maxLevel; j++) headPlcListArray.push([])
    // 收集多级表头渲染数据
    const calculateHeadColumns = (list: tPlcType[]) => {
        if (!!list && list.length > 0) {
            list.forEach((item) => {
                headPlcListArray[item.level!].push(item)
                if (item.group) {
                    calculateHeadColumns((item).children)
                }
            })
        }
    }
    calculateHeadColumns(plcList)
    setFixedFlag(headPlcListArray[0])

    return {
        headPlcListArray,
        maxLevel,
    }
}

/**
 * 对plc设置标记，是否为最后一个左固定列，是否为第一个右固定列
 * @author  韦胜健
 * @date    2020/8/15 23:06
 */
function setFixedFlag(plcList: tPlcType[]) {
    let lastFixedLeft: tPlcType | undefined;
    let firstFixedRight: tPlcType | undefined;

    plcList.forEach(plc => {
        if (plc.props.fixed === TablePlcFixedType.left) {
            lastFixedLeft = plc
        }
        if (!firstFixedRight && plc.props.fixed === TablePlcFixedType.right) {
            firstFixedRight = plc
        }
    })

    /**
     * 递归设置，每一层的lastFixedLeft
     * @author  韦胜健
     * @date    2020/12/18 14:46
     */
    function setLastFixedLeft(plc: tPlcType) {
        plc.isLastFixedLeft = true
        if (plc.group) {
            setLastFixedLeft(plc.children[plc.children.length - 1])
        }
    }

    !!lastFixedLeft && setLastFixedLeft(lastFixedLeft);

    /**
     * 递归设置每一层的firstFixedRight
     * @author  韦胜健
     * @date    2020/12/18 14:46
     */
    function setFirstFixedRight(plc: tPlcType) {
        plc.isFirstFixedRight = true
        if (plc.group) {
            setFirstFixedRight(plc.children[0])
        }
    }

    !!firstFixedRight && setFirstFixedRight(firstFixedRight)
}