import {TablePlc} from "../core/plc.type";
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
    const {headPlcListArray} = processHeadPlcList({plcList})
    /*计算固定列所需要的left，right值*/
    processPlcFixed(flatPlcList)
    /*计算plc的class以及style*/
    processPlcClassAndStyle({headPlcListArray})

    return {
        plcList,
        flatPlcList,
        targetTableWidth,
        notFitVirtual,
        headPlcListArray,
        plcKeyString,
    }
}