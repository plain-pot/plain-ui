import {Plc, TablePlc} from "../core/plc.type";
import {IteratePlcHandleType, iteratePlcList} from "./utils/iteratePlcList";
import {copyPlcList} from "./process/copyPlcList";
import {processStateConfigAndProps} from "./process/processStateConfigAndProps";
import {ExtractPropTypes} from 'vue';
import {TableProps} from "../../core/table.utils";

export function formatPlcList(
    {
        plcList,
        props,
    }: {
        plcList: TablePlc[],
        props: ExtractPropTypes<typeof TableProps>,
    }
) {
    /*复制一份plc数据*/
    plcList = copyPlcList(plcList)
    /*处理state、config以及props*/
    const {notFitVirtual} = processStateConfigAndProps({plcList, config: props.config})
    

    const flatPlcList = [] as Plc[]

    iteratePlcList({
        plcList,
        onPlc: plc => {
            flatPlcList.push(plc)
            return IteratePlcHandleType.nothing
        },
        onGroup: group => {
            return IteratePlcHandleType.nothing
        }
    })

    return {
        plcList,
        flatPlcList,
    }
}