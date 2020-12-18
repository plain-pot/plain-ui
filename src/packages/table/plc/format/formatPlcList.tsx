import {Plc, TablePlc} from "../core/plc.type";
import {IteratePlcHandleType, iteratePlcList} from "./utils/iteratePlcList";
import {copyPlcList} from "./process/copyPlcList";

export function formatPlcList(
    {
        plcList,
    }: {
        plcList: TablePlc[]
    }
) {

    plcList = copyPlcList(plcList)

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