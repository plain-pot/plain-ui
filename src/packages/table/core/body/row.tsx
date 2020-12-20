import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {PltCell} from "./cell";
import {TableNode} from "../useTableNode";

export const PltRow = designComponent({
    name: 'plt-row',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
    },
    setup({props}) {

        const handler = {
            onClick: (e: MouseEvent) => props.table.tableCurrent.onClickRow(e, props.node),
            onDblclick: (e: MouseEvent) => props.table.tableCurrent.onDblclickRow(e, props.node),
        }

        return {
            render: () => (
                <tr class="plt-row" style={`height:${props.table.numberState.bodyRowHeight}px`} {...handler}>
                    {props.table.plcData.value!.flatPlcList.map(plc => <PltCell table={props.table} node={props.node} plc={plc}/>)}
                </tr>
            )
        }
    },
})