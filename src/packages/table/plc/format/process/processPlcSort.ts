import {Plc, TablePlc} from "../../core/plc.type";
import {IteratePlcHandleType, iteratePlcList} from "../utils/iteratePlcList";
import {insertSort} from "plain-utils/object/insertSort";
import {TablePlcFixedType} from "../../../core/table.utils";

/**
 * 获取plc的排序索引
 * @author  韦胜健
 * @date    2020/12/18 14:23
 */
function getPlcOrder(item: TablePlc): number {
    let order = item.props.order || 0
    if (item.props.fixed === TablePlcFixedType.left) {
        order -= 9999
    } else if (item.props.fixed === TablePlcFixedType.right) {
        order += 9999
    }
    return Number(order)
}

/**
 * 对plc进行排序
 * @author  韦胜健
 * @date    2020/8/15 19:18
 */
export function processPlcSort(
    {
        plcList,
        tableWidth,
    }: {
        plcList: TablePlc[],
        tableWidth: number
    }
) {
    const fitPlcList = [] as Plc[]                                  // 有fit的plc数组，只有 PlcType 才可以设置fit
    const flatPlcList = [] as Plc[]                                 // 平级的，最终渲染在表格上的plc数组

    iteratePlcList({
        plcList,
        onPlc: plc => {
            flatPlcList.push(plc)
            if (plc.props.fit) {
                fitPlcList.push(plc)
            }
            return IteratePlcHandleType.nothing
        },
        onGroup: group => {
            insertSort(group.children, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return IteratePlcHandleType.nothing
        }
    })
    insertSort(plcList, (a, b) => getPlcOrder(a) > getPlcOrder(b))

    return {
        fitPlcList,
        flatPlcList,
    }
}