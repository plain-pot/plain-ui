import {PlcComponentType} from "@/packages/table/plc/plc-utils";
import {getCurrentInstance} from "@vue/composition-api";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";

function renderPlc(h: Function, plc: PlcType | PlcGroupType) {
    return (
        plc.type === PlcComponentType.PLC ? (
            <div>
                PLC：{plc.props.title}:{(plc as PlcType).props.width}
            </div>
        ) : (
            <div>
                <div>GROUP：{plc.props.title}</div>
                <div style={{paddingLeft: "20px"}}>
                    {(plc as PlcGroupType).items.value.map(i => (renderPlc(h, i)))}
                </div>
            </div>
        )
    )
}

export function printPlcData(plcData: any) {
    const ctx = getCurrentInstance()!
    const h = ctx.$createElement

    return plcData.map(item => renderPlc(h, item))
}