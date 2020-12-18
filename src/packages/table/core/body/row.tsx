import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {SimpleObject} from "../../../../shims";
import {PltCell} from "./cell";

export const PltRow = designComponent({
    name: 'plt-row',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<SimpleObject>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <tr>
                    {props.table.plcData.value!.flatPlcList.map(plc => <PltCell table={props.table} node={props.node} plc={plc}/>)}
                </tr>
            )
        }
    },
})