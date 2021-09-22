import {tPlc, tPlcType} from "../utils/plc.type";
import {copyPlcList} from "./process/copyPlcList";
import {processAutoFixed} from "./process/processAutoFixed";
import {TablePropsConfig} from "../../table/utils/table.utils";
import {processPlcSort} from "./process/processPlcSort";
import {processHeadPlcList} from "./process/processHeadPlcList";
import {processPlcFixed} from "./process/processPlcFixed";
import {processPlcClassAndStyle} from "./process/processPlcClassAndStyle";
import {IteratePlcHandleType, iteratePlcList} from "./utils/iteratePlcList";

export function formatPlcList(
    {
        plcList: sourceList,
        tableWidth,
        configPlcTypes,
    }: {
        plcList: tPlcType[],
        tableWidth: number,
        configPlcTypes: TablePropsConfig,
    }
) {

    /*config plcTypes*/
    (() => {
        const flatPlcList: tPlc[] = []
        iteratePlcList({
            plcList: sourceList,
            onPlc: (plc) => {
                flatPlcList.push(plc)
                return IteratePlcHandleType.nothing
            },
            onGroup: () => IteratePlcHandleType.nothing,
        })
        configPlcTypes(sourceList, flatPlcList)
    })();

    /*复制一份plc数据*/
    const plcList = copyPlcList(sourceList)

    const sourceFlatPlcList: tPlc[] = (() => {
        const list: tPlc[] = []
        iteratePlcList({
            plcList,
            onGroup: () => IteratePlcHandleType.nothing,
            onPlc: (plc) => {
                list.push(plc)
                return IteratePlcHandleType.nothing
            }
        })
        return list
    })()

    /*先处理AutoFixed*/
    processAutoFixed({plcList})
    /*对plc进行排序*/
    const {flatPlcList, targetTableWidth, plcKeyString} = processPlcSort({plcList, tableWidth})
    /*计算表头渲染需要的数据*/
    const {headPlcListArray, maxLevel} = processHeadPlcList({plcList})
    /*计算固定列所需要的left，right值*/
    processPlcFixed(flatPlcList)
    /*计算plc的class以及style*/
    processPlcClassAndStyle({headPlcListArray})

    sourceFlatPlcList.sort((a, b) => {
        let aSeq = flatPlcList.indexOf(a)
        if (aSeq === -1) {aSeq = 999999}
        let bSeq = flatPlcList.indexOf(b)
        if (bSeq === -1) {bSeq = 999999}
        return aSeq - bSeq
    })

    return {
        sourceFlatPlcList,
        sourceList,                                             // 原始列数组数据，树形结构的数据(修改props有效)
        plcList,                                                // 原始列数组数据的一份拷贝
        flatPlcList,                                            // 展开之后最底层的列数组(修改props无效)
        targetTableWidth,                                       // 表格设置的样式宽度
        tableWidth,                                             // 表格容器宽度
        headPlcListArray,                                       // 表头渲染的二维数组
        plcKeyString,                                           // 当列排序或者其他属性变化之后，需要刷新body，否则会出现部分节点没有更新的问题
        maxLevel,                                               // 表头层级
    }
}

export type tPlcData = ReturnType<typeof formatPlcList>