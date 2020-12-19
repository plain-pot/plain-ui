import {TablePlc} from "../../core/plc.type";

export function getPltCellClass(plc: TablePlc) {
    return {
        // 'pl-cell-group': plc.group,
        [`plt-cell-align-${plc.props.align}`]: !!plc.props.align,
    }
}