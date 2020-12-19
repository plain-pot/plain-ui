import {TablePlc} from "../../core/plc.type";
import {TablePlcAlign} from "../../../core/table.utils";

export function getPltCellClass(plc: TablePlc) {
    return [
        `plt-cell-align-${plc.props.align || TablePlcAlign.left}`,
        {
            'pl-cell-group': plc.group,
        }
    ]
}