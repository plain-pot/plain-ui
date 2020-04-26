import {Plc} from "../plc/plc-utils";

export const TableComponentMixin = {
    inject: {
        plTable: {default: null}
    },
}

export function getCellClass(context, plc: Plc, rowData) {
    return [
        `plt-cell-align-${plc.props.align || 'left'}`,
        {
            'pl-cell-group': plc.group,
        }
    ]
}

export const enum TableHoverPart {
    body = 'body',
    head = 'head'
}