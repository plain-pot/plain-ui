import {PlcComponentType} from "@/packages/table/plc/plc-utils";
import {getCurrentInstance} from "@vue/composition-api";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";

function renderPlc(h, plc: PlcType) {
    return (
        <div key={plc.props.title}>
            PLC：{plc.props.title}:{plc.props.width}_{plc.props.field}_{plc.props.fixed}
        </div>
    )
}

function renderGroup(h, group: PlcGroupType) {
    return (
        <div key={group.props.title}>
            <div>GROUP：{group.props.title}</div>
            <div style={{paddingLeft: "20px"}}>
                {group.items.value.map(i => print(h, i))}
            </div>
        </div>
    )
}

function print(h: Function, plc: PlcType | PlcGroupType) {
    return plc.type === PlcComponentType.PLC ? renderPlc(h, plc as PlcType) : renderGroup(h, plc as PlcGroupType)
}

export function printPlcData(plcData: any) {
    const ctx = getCurrentInstance()!
    const h = ctx.$createElement

    return plcData.map(item => print(h, item))
}