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
        tableWidth: number,
    }
) {
    insertSort(plcList, (a, b) => getPlcOrder(a) > getPlcOrder(b))
    /*计算 flatPlcList 自己 targetTableWidth*/
    const flatPlcList = [] as Plc[]
    iteratePlcList({
        plcList,
        onPlc: plc => {
            flatPlcList.push(plc)
            return IteratePlcHandleType.nothing
        },
        onGroup: group => {
            group.children = insertSort(group.children, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return IteratePlcHandleType.nothing
        }
    })

    /*计算表格需要固定的宽度*/
    const {targetTableWidth, plcKeyString} = (() => {
        let totalPlcWidth = 0;                                          // 总的plc宽度
        let fitPlc = null as null | Plc                                 // 需要自适应宽度的plc
        const plcKeyString = [] as string[]
        flatPlcList.forEach(plc => {
            totalPlcWidth += plc.props.width
            if (plc.props.fit) {
                fitPlc = plc
            } else if ((!fitPlc || !fitPlc.props.fit) && plc.props.fixed === TablePlcFixedType.center) {
                fitPlc = plc
            }
            plcKeyString.push(plc.props.field || 'empty')
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
        return {targetTableWidth, plcKeyString: plcKeyString.join('_')}
    })();

    return {
        targetTableWidth,
        flatPlcList,
        plcKeyString,
    }
}