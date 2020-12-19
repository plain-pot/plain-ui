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
        return {
            render: () => (
                <tr class="plt-row" style={`height:${props.table.numberState.bodyRowHeight}px`}>
                    {props.table.plcData.value!.flatPlcList.map(plc => <PltCell table={props.table} node={props.node} plc={plc}/>)}
                </tr>
            )
        }
    },
})