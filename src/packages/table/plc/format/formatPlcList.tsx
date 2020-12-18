import {TablePlc} from "../core/plc.type";

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

    return {
        plcList,
    }
}