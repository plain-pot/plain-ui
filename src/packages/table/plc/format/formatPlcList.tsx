import {Plc, TablePlc} from "../core/plc.type";
import {copyPlcList} from "./process/copyPlcList";
import {processStateConfigAndProps} from "./process/processStateConfigAndProps";
import {ExtractPropTypes} from 'vue';
import {TableProps} from "../../core/table.utils";
import {processPlcSort} from "./process/processPlcSort";
import {processHeadPlcList} from "./process/processHeadPlcList";
import {processPlcFixed} from "./process/processPlcFixed";
import {processPlcClassAndStyle} from "./process/processPlcClassAndStyle";

export function formatPlcList(
    {
        plcList,
        props,
        tableWidth,
    }: {
        plcList: TablePlc[],
        props: ExtractPropTypes<typeof TableProps>,
        tableWidth: number,
    }
) {
    /*复制一份plc数据*/
    plcList = copyPlcList(plcList)
    /*处理state、config以及props*/
    const {notFitVirtual} = processStateConfigAndProps({plcList, config: props.config})
    /*对plc进行排序*/
    const {flatPlcList, targetTableWidth, plcKeyString} = processPlcSort({plcList, tableWidth})
    /*计算表头渲染需要的数据*/
    const {headPlcListArray, maxLevel} = processHeadPlcList({plcList})
    /*计算固定列所需要的left，right值*/
    processPlcFixed(flatPlcList)
    /*计算plc的class以及style*/
    processPlcClassAndStyle({headPlcListArray})

    /*需要在行之后渲染其他内容的plcList*/
    let plcListHasRenderAfterRow = flatPlcList.filter(plc => plc.props.renderAfterRow) as (Plc[] | null)
    if (!!plcListHasRenderAfterRow && plcListHasRenderAfterRow.length === 0) {plcListHasRenderAfterRow = null}

    return {
        plcList,                                                // 列数组数据，树形结构的数据
        flatPlcList,                                            // 展开之后最底层的列数组
        targetTableWidth,                                       // 表格设置的样式宽度
        tableWidth,                                             // 表格容器宽度
        notFitVirtual,                                          // 不兼容虚拟列表的列数组
        headPlcListArray,                                       // 表头渲染的二维数组
        plcKeyString,                                           // 当列排序或者其他属性变化之后，需要刷新body，否则会出现部分节点没有更新的问题
        maxLevel,                                               // 表头层级
        plcListHasRenderAfterRow,                               // 列需要在行之后多渲染的数据
    }
}