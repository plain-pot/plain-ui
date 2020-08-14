import {PlcType} from "@/packages/table/plc/plc";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";
import {StyleType} from "@/types/utils";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {computed} from "@vue/composition-api";

export function getCellStyles(plc: PlcType | PlcGroupType) {
    return computed(() => {
        if (plc.props.fixed === PlcFixedType.center) {
            return null
        }
        const ret = {} as StyleType
        ret.position = 'sticky'
        ret.zIndex = '1'

        if (!isPlcGroup(plc)) {
            ret[plc.props.fixed] = plc.fixedPosition[plc.props.fixed] + 'px'
        } else {
            let count = 10
            const fixedLeft = plc.props.fixed === PlcFixedType.left
            while (!!plc && isPlcGroup(plc) && count > 0) {
                plc = plc.items.value[fixedLeft ? 0 : plc.items.value.length - 1]
                count--
            }
            if (count === 0 && !!plc) {
                throw new Error('解析异常')
            }
            if (!!plc) {
                // @ts-ignore
                ret[plc.props.fixed] = plc.fixedPosition[plc.props.fixed] + 'px'
            }
        }
        return ret
    })
}