import {tPlcType} from "../../utils/plc.type";

export function getPltCellClass(plc: tPlcType) {
    return {
        // 'pl-cell-group': plc.group,
        [`plt-cell-align-${plc.props.align}`]: !!plc.props.align,
    }
}