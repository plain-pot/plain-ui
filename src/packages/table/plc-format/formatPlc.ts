import {TablePlc} from "../plc-core/plc.type";

function copyPlc(plcList: (TablePlc)[]): (TablePlc)[] {
    return plcList.map(plc => {
        const newPlc = {...plc}
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

}