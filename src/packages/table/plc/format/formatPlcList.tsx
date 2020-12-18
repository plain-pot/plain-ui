import {Plc, TablePlc} from "../core/plc.type";
import {IteratePlcHandleType, iteratePlcList} from "./utils/iteratePlcList";
import {copyPlcList} from "./process/copyPlcList";
import {processStateConfigAndProps} from "./process/processStateConfigAndProps";
import {ExtractPropTypes} from 'vue';
import {TableProps} from "../../core/table.utils";
import {processPlcSort} from "./process/processPlcSort";
import {processHeadPlcList} from "./process/processHeadPlcList";

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
    const {flatPlcList, targetTableWidth} = processPlcSort({plcList, tableWidth})
    /*计算表头渲染需要的数据*/
    const {headPlcListArray} = processHeadPlcList(plcList)

    return {
        plcList,
        flatPlcList,
        targetTableWidth,
        notFitVirtual,
        headPlcListArray,
    }
}