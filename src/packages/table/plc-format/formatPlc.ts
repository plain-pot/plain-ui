import {TablePlc} from "../plc-core/plc.type";

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
    }: {
        plcList: (TablePlc)[]
    }
) {
    plcList = copyPlc(plcList)

    return {
        plcList
    }
}