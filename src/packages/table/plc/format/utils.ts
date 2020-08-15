import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

/**
 * 在遍历plc的时候，操作类型，remove意思是遍历完这一次之删除这个plc或者plc组
 * @author  韦胜健
 * @date    2020/8/14 17:26
 */
export const enum HandlePlcType {
    remove = 'remove',
    nothing = 'nothing'
}

/**
 * 遍历plc数组
 * @author  韦胜健
 * @date    2020/6/9 20:58
 */
export function iteratePlc({list, handlePlc, handleGroup}: {
    list: (PlcType | PlcGroupType)[] | null,
    handlePlc: (plc: PlcType) => HandlePlcType,
    handleGroup: (group: PlcGroupType) => HandlePlcType,
}): void {

    list = list || [];

    for (let i = 0; i < list.length; i++) {
        let item = list[i];

        switch (item.type) {
            case PlcComponentType.PLC:
                item = item as PlcType
                const handlePlcResult = handlePlc(item)
                if (handlePlcResult === HandlePlcType.remove) {
                    list.splice(i, 1)
                    i--
                }
                break
            case PlcComponentType.GROUP:
                item = item as PlcGroupType
                const handlePlcGroupResult = handleGroup(item)
                if (handlePlcGroupResult === HandlePlcType.remove) {
                    list.splice(i, 1)
                    i--
                } else {
                    iteratePlc({list: item.items.value, handlePlc, handleGroup})

                    // 当这个分组没有列的时候（可能都隐藏了），自动删除这个分组
                    if (item.items.value.length === 0) {
                        list.splice(i, 1)
                        i--
                    }
                }
                break
            default:
                console.warn(item)
                throw new Error(`can't recognise plc type:${item.type}`)
        }
    }
}