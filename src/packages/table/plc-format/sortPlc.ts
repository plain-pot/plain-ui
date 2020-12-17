/**
 * 获取plc的排序索引
 * @author  韦胜健
 * @date    2020/8/14 17:23
 */
import {PlcType, TablePlc} from "../plc-core/plc.type";
import {TablePlcFixedType} from "../plc-core/plc.utils";
import {iteratePlc, IteratePlcHandleType} from "./iteratePlc";
import {insertSort} from "plain-utils/object/insertSort";

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
export function sortPlc(items: TablePlc[]) {

    let totalFits = 0                                               // fit总和值
    let totalNoFitPlcWidth = 0                                      // 没有fit的plc的总宽度
    const fitPlcList = [] as PlcType[]                              // 有fit的plc数组，只有 PlcType 才可以设置fit
    const flatPlcList = [] as PlcType[]                             // 平级的，最终渲染在表格上的plc数组

    /**
     * - 根据 order、fixed排序
     * - 算出总的fit、剩余的externalWidth宽度
     * @author  韦胜健
     * @date    2020/8/12 10:26
     */
    iteratePlc({
        plcList: items,
        onPlc: (plc) => {
            flatPlcList.push(plc)
            if (!!plc.props.fit) {
                totalFits += plc.props.fit
                fitPlcList.push(plc)
            } else {
                totalNoFitPlcWidth += plc.props.width as number
            }
            return IteratePlcHandleType.nothing
        },
        onGroup: (group) => {
            insertSort(group.children, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return IteratePlcHandleType.nothing
        }
    })

    insertSort(items, (a, b) => {
        const ao = getPlcOrder(a)
        const bo = getPlcOrder(b)
        return ao > bo
    })

    /*items.forEach(item => {
        console.log(item.props.title, item.props.order)
    })*/

    return {
        flatPlcList,
        totalFits,
        totalNoFitPlcWidth,
        fitPlcList,
    }
}