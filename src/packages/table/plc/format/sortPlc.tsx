import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {$plain} from "@/packages/base";
import {HandlePlcType, iteratePlc} from "@/packages/table/plc/format/utils";


/**
 * 获取plc的排序索引
 * @author  韦胜健
 * @date    2020/8/14 17:23
 */
function getPlcOrder(item: PlcType | PlcGroupType): number {
    let order = item.props.order || 0
    if (item.props.fixed === PlcFixedType.left) {
        order -= 9999
    } else if (item.props.fixed === PlcFixedType.right) {
        order += 9999
    }
    return Number(order)
}

/**
 * 对plc进行排序
 * @author  韦胜健
 * @date    2020/8/15 19:18
 */
export function sortPlc(items: (PlcType | PlcGroupType)[]) {

    let totalFits = 0                                               // fit总和值
    let totalNoFitPlcWidth = 0                                      // 没有fit的plc的总宽度
    const fitPlcList = [] as (PlcType)[]                            // 有fit的plc数组，只有 PlcType 才可以设置fit
    const flatPlcList = [] as PlcType[]                             // 平级的，最终渲染在表格上的plc数组

    /**
     * - 根据 order、fixed排序
     * - 算出总的fit、剩余的externalWidth宽度
     * @author  韦胜健
     * @date    2020/8/12 10:26
     */
    iteratePlc({
        list: [{type: PlcComponentType.GROUP, items: {value: items}} as any],
        handlePlc: (plc) => {
            flatPlcList.push(plc)
            if (!!plc.props.fit) {
                totalFits += plc.props.fit
                fitPlcList.push(plc)
            } else {
                totalNoFitPlcWidth += plc.props.width as number
            }

            return HandlePlcType.nothing
        },
        handleGroup: (group) => {
            $plain.utils.insertSort(group.items.value, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return HandlePlcType.nothing
        }
    })

    return {
        flatPlcList,
        totalFits,
        totalNoFitPlcWidth,
        fitPlcList,
    }
}