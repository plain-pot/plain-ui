import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

/**
 * 计算渲染表头所需要的的plc二维数组
 * @author  韦胜健
 * @date    2020/8/15 19:27
 */
export function getHeadPlc(plcList: (PlcType | PlcGroupType)[]) {
    // 最大表头层数
    let maxLevel = 1

    // 计算最大层数
    const calculateLevel = (list: (PlcType | PlcGroupType)[] | null, level) => {
        if (!!list && list.length > 0) {
            if (level > maxLevel) maxLevel = level
            list.forEach((item) => {
                item.level = level - 1
                if (item.type === PlcComponentType.GROUP) {
                    calculateLevel((item as PlcGroupType).items.value, level + 1)
                }
            })
        }
    }
    calculateLevel(plcList, 1)

    // 计算多级表头每个单元格所占行数以及列数
    const calculateSpan = (item: PlcType | PlcGroupType) => {
        if (item.type === PlcComponentType.GROUP) {
            const group = item as PlcGroupType
            group.items.value.forEach(calculateSpan)
            group.rowspan = 1
            group.colspan = 0
            group.items.value.forEach(i => group.colspan! += i.colspan!)
        } else {
            const plc = item as PlcType
            plc.rowspan = maxLevel - plc.level!
            plc.colspan = 1
        }
    }
    plcList.forEach(plc => calculateSpan(plc))

    // 计算结果
    const headCols: (PlcType | PlcGroupType)[][] = []

    for (let j = 0; j < maxLevel; j++) headCols.push([])
    // 收集多级表头渲染数据
    const calculateHeadColumns = (list: (PlcType | PlcGroupType)[]) => {
        if (!!list && list.length > 0) {
            list.forEach((item) => {
                headCols[item.level!].push(item)
                if (item.type === PlcComponentType.GROUP) {
                    calculateHeadColumns((item as PlcGroupType).items.value)
                }
            })
        }
    }
    calculateHeadColumns(plcList)

    return headCols
}