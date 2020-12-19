import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {Plc} from "../../plc/core/plc.type";
import {TableNode} from "../useTableNode";

export const PltCell = designComponent({
    name: 'plt-cell',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        plc: {type: Object as PropType<Plc>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <td>
                    {props.node.data[props.plc.props.field!]}
                </td>
            )
        }
    },
})