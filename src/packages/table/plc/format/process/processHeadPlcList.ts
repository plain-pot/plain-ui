import {Plc, TablePlc} from "../../core/plc.type";
import {TablePlcFixedType} from "../../../core/table.utils";

/**
 * 对plc设置标记，是否为最后一个左固定列，是否为第一个右固定列
 * @author  韦胜健
 * @date    2020/8/15 23:06
 */
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

    /**
     * 递归设置，每一层的lastFixedLeft
     * @author  韦胜健
     * @date    2020/12/18 14:46
     */
    function setLastFixedLeft(plc: TablePlc) {
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
    function setFirstFixedRight(plc: TablePlc) {
        plc.isFirstFixedRight = true
        if (plc.group) {
            setFirstFixedRight(plc.children[0])
        }
    }

    !!firstFixedRight && setFirstFixedRight(firstFixedRight)
}

/**
 * 计算渲染表头所需要的二维数组以及层数
 * @author  韦胜健
 * @date    2020/12/18 14:38
 */
export function processHeadPlcList({plcList, tableWidth}: { plcList: TablePlc[], tableWidth: number }) {
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
            group.children.forEach(i => group.colspan += i.colspan)
        } else {
            const plc = item
            plc.rowspan = maxLevel - plc.level
            plc.colspan = 1
        }
    }
    plcList.forEach(plc => calculateSpan(plc))

    // 计算结果
    const headPlcListArray: TablePlc[][] = []

    for (let j = 0; j < maxLevel; j++) headPlcListArray.push([])
    // 收集多级表头渲染数据
    const calculateHeadColumns = (list: TablePlc[]) => {
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

    /*计算 flatPlcList 自己 targetTableWidth*/
    const flatPlcList = headPlcListArray[headPlcListArray.length - 1] as Plc[]
    /*计算表格需要固定的宽度*/
    const {targetTableWidth} = (() => {
        let totalPlcWidth = 0;                                          // 总的plc宽度
        let fitPlc = null as null | Plc                                 // 需要自适应宽度的plc
        flatPlcList.forEach(plc => {
            totalPlcWidth += plc.props.width
            if (plc.props.fit) {
                fitPlc = plc
            } else if ((!fitPlc || !fitPlc.props.fit) && plc.props.fixed === TablePlcFixedType.center) {
                fitPlc = plc
            }
        })
        /**
         * 目标table宽度，当总宽度小于tableWidth时，table不设置width宽度。因为table设置了min-width为100%，此时fit的列会自适应宽度。
         * 当总宽度大于tableWidth时，table需要设置width宽度，否则会导致列被压缩
         * @author  韦胜健
         * @date    2020/12/18 15:28
         */
        let targetTableWidth = totalPlcWidth > tableWidth ? totalPlcWidth : null
        if (!targetTableWidth && !!fitPlc) {
            fitPlc.props.width = 0
        }
        return {targetTableWidth,}
    })();


    return {
        headPlcListArray,
        flatPlcList,
        targetTableWidth,
    }
}