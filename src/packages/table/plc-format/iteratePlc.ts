import {PlcGroup, PlcType, TablePlc} from "../plc-core/plc.type";

/**
 * 在遍历plc的时候，操作类型，remove意思是遍历完这一次之删除这个plc或者plc组
 * @author  韦胜健
 * @date    2020/8/14 17:26
 */
export const enum IteratePlcHandleType {
    remove = 'remove',                      // 移除当前节点
    nothing = 'nothing'                     // 什么事也不做
}

export function iteratePlc(
    {
        plcList,
        onPlc,
        onGroup,
    }: {
        plcList: TablePlc[],
        onPlc: (plc: PlcType) => IteratePlcHandleType,
        onGroup: (group: PlcGroup) => IteratePlcHandleType,
    }
) {

    for (let i = 0; i < plcList.length; i++) {
        const plc = plcList[i];
        if (!plc.group) {
            const handleType = onPlc(plc)
            if (handleType === IteratePlcHandleType.remove) {
                plcList.splice(i, 1)
                i--
            }
        } else {
            const handleType = onGroup(plc)
            if (handleType === IteratePlcHandleType.remove) {
                plcList.splice(i, 1)
                i--
            } else {
                iteratePlc({plcList: plc.children, onPlc, onGroup,})
                // 当这个分组没有列的时候（可能都隐藏了），自动删除这个分组
                if (plc.children.length === 0) {
                    plcList.splice(i, 1)
                    i--
                }
            }
        }
    }

}