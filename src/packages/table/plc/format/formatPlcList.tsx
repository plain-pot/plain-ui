import {Plc, TablePlc} from "../core/plc.type";
import {IteratePlcHandleType, iteratePlcList} from "./iteratePlcList";

/**
 * 复制一份plc数据
 * @author  韦胜健
 * @date    2020/12/18 10:06
 */
function copyPlcList(plcList: TablePlc[]) {
    return plcList.map(plc => {
        const newPlc = {...plc.refer()}
        newPlc.props = {...newPlc.props}
        if (newPlc.group) {
            newPlc.children = copyPlcList(newPlc.children)
        }
        return newPlc
    })
}

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