import {TablePlc} from "../plc-core/plc.type";
import {configAndStatePlc} from "./configAndStatePlc";
import {TableConfigFunc} from "../table.type";
import {sortPlc} from "./sortPlc";
import {getHeadPlc} from "./getHeadPlc";
import {writeFixedPosition} from "./plc.fixed";
import {writeStylesAndClasses} from "./classAndStyle";

/**
 * 拷贝一份plc
 * @author  韦胜健
 * @date    2020/12/17 10:43
 */
function copyPlc(plcList: (TablePlc)[]): (TablePlc)[] {
    return plcList.map(plc => {
        const newPlc = {...plc.self()}
        newPlc.props = {...newPlc.props}
        if (newPlc.group) {
            newPlc.children = copyPlc(newPlc.children)
        }
        return newPlc
    })
}

export function formatPlc(
    {
        plcList,
        config,
        tableWidth,
        bodyRowHeight,
        headRowHeight,
    }: {
        plcList: (TablePlc)[],
        config?: TableConfigFunc,
        tableWidth: number,
        bodyRowHeight: number,
        headRowHeight: number,

    }
) {

    /**
     * 这里复制了一份这个items，所以如果这里对items进行修改，是不会导致引起响应式刷新的
     * @author  韦胜健
     * @date    2020/8/14 15:10
     */
    plcList = copyPlc(plcList)

    const {
        notFitVirtual,
        // autoFixedLeft,
        // autoFixedRight,
        // fixedLeft,
        // fixedRight
    } = configAndStatePlc({plcList, config})

    /*---------------------------------------获取plc的排序索引-------------------------------------------*/

    let {
        totalFits,
        totalNoFitPlcWidth,
        fitPlcList,
        flatPlcList,
    } = sortPlc(plcList)

    /*---------------------------------------计算表头需要的plc二维数组-------------------------------------------*/

    const {headCols, maxLevel} = getHeadPlc(plcList)

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

    /*---------------------------------------写入公共的style以及class-------------------------------------------*/

    writeStylesAndClasses({
        headCols,
        headRowHeight,
        bodyRowHeight,
    })

    /*---------------------------------------return-------------------------------------------*/

    return {
        notFitVirtualPlcList: notFitVirtual,                                                                // 不兼容虚拟列表的列数组
        plcList,                                                                                            // 列数组数据，树形结构的数据
        flatPlcList,                                                                                        // 展开之后最底层的列数组
        flatPlcLength: flatPlcList.length,                                                                  // 展开之后最底层的列数组长度
        plcListHasRenderAfterRow: flatPlcList.filter(item => !!item.props.renderAfterRow),        // 列需要在行之后多渲染的数据
        headCols,
        maxLevel,
    }
}