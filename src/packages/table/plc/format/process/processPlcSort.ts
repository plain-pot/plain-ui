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

    let totalPlcWidth = 0;                                          // 总的plc宽度
    const fitPlcList = [] as Plc[]                                  // 有fit的plc数组，只有 PlcType 才可以设置fit
    const flatPlcList = [] as Plc[]                                 // 平级的，最终渲染在表格上的plc数组
    let lastNotFitAndNotFixedPlc = null as null | Plc               // 最后一个没有fit也没有fixed的列

    iteratePlcList({
        plcList,
        onPlc: plc => {
            totalPlcWidth += plc.props.width
            flatPlcList.push(plc)
            if (plc.props.fit) {
                fitPlcList.push(plc)
            } else {
                if (plc.props.fixed === TablePlcFixedType.center) {
                    lastNotFitAndNotFixedPlc = plc
                }
            }
            return IteratePlcHandleType.nothing
        },
        onGroup: group => {
            insertSort(group.children, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return IteratePlcHandleType.nothing
        }
    })
    insertSort(plcList, (a, b) => getPlcOrder(a) > getPlcOrder(b))

    /**
     * 目标table宽度，当总宽度小于tableWidth时，table不设置width宽度。因为table设置了min-width为100%，此时fit的列会自适应宽度。
     * 当总宽度大于tableWidth时，table需要设置width宽度，否则会导致列被压缩
     * @author  韦胜健
     * @date    2020/12/18 15:28
     */
    let targetTableWidth = totalPlcWidth > tableWidth ? totalPlcWidth : null
    if (!targetTableWidth && !!lastNotFitAndNotFixedPlc) {
        lastNotFitAndNotFixedPlc.props.width = 0
    }

    return {
        fitPlcList,
        flatPlcList,
        targetTableWidth,
    }
}