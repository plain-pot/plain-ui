import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {writeFixedPosition} from "@/packages/table/plc/plc-fixed";
import {configAndStatePlc} from "@/packages/table/plc/format/configAndStatePlc";
import {sortPlc} from "@/packages/table/plc/format/sortPlc";
import {getHeadPlc} from "@/packages/table/plc/format/getHeadPlc";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

/**
 * 复制列信息数组
 * @author  韦胜健
 * @date    2020/8/14 17:23
 */
function copyPlcList(items: (PlcType | PlcGroupType)[]) {
    const newItems: (PlcType | PlcGroupType)[] = []
    items.forEach((item) => {
        const newItem = {...item}
        if (item.type === PlcComponentType.GROUP) {
            (newItem as PlcGroupType).items.value = copyPlcList((newItem as PlcGroupType).items.value)
        }
        newItems.push(newItem)
    })

    return newItems
}

export function formatPlc(
    {
        items,
        config,
        tableWidth,
    }: {
        items: (PlcType | PlcGroupType)[],                              // plc列原始数据
        config: Function | undefined,                                   // 配置plc的函数
        tableWidth: number                                              // 表格宽度
    }) {

    /*---------------------------------------复制一份plc，并且处理config以及state-------------------------------------------*/

    /**
     * 这里复制了一份这个items，所以如果这里对items进行修改，是不会导致引起响应式刷新的
     * @author  韦胜健
     * @date    2020/8/14 15:10
     */
    items = copyPlcList(items)

    const {
        notFitVirtual,
        // autoFixedLeft,
        // autoFixedRight,
        // fixedLeft,
        // fixedRight
    } = configAndStatePlc({items, config})

    /*---------------------------------------获取plc的排序索引-------------------------------------------*/

    let {
        totalFits,
        totalNoFitPlcWidth,
        fitPlcList,
        flatPlcList,
    } = sortPlc(items)

    /*---------------------------------------计算表头需要的plc二维数组-------------------------------------------*/

    const headCols = getHeadPlc(items)

    /*---------------------------------------自动计算列宽-------------------------------------------*/

    let externalWidth = tableWidth - totalNoFitPlcWidth

    // 剩余宽度还大于0
    if (externalWidth > 0) {
        // 如果没有自适应宽度的列，则默认最后一列自适应宽度
        if (totalFits === 0) {
            totalFits = 1
            const lastPlc = flatPlcList[flatPlcList.length - 1]
            fitPlcList.push(lastPlc)
            externalWidth += lastPlc.props.width as number
        }
        const fitBlockWidth = Math.floor(externalWidth / totalFits)
        fitPlcList.forEach((plc, index) => {
            if (index === fitPlcList.length - 1) {
                // 如果是最后一个，用完剩下的宽度
                plc.props.width = externalWidth - 1
                externalWidth = 0
            } else {
                // 根据fit分配宽度
                const newWidth = plc.props.fit * fitBlockWidth
                plc.props.width = newWidth
                externalWidth -= newWidth
            }
        })
    }

    /*---------------------------------------计算固定列的定位值，顺便计算左右固定列的总宽度-------------------------------------------*/

    writeFixedPosition(flatPlcList)

    /*---------------------------------------return-------------------------------------------*/

    return {
        notFitVirtualPlcList: notFitVirtual,                                                                // 不兼容虚拟列表的列数组
        plcList: items,                                                                                     // 列数组数据，树形结构的数据
        flatPlcList,                                                                                        // 展开之后最底层的列数组
        flatPlcLength: flatPlcList.length,                                                                  // 展开之后最底层的列数组长度
        plcListHasRenderAfterRow: flatPlcList.filter(item => !!item.props.renderAfterRow),        // 列需要在行之后多渲染的数据
        headCols,
    }
}