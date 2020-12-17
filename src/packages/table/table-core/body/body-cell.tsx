import {designComponent} from "../../../../use/designComponent";
import {PropType} from 'vue';
import {PlcType} from "../../plc-core/plc.type";
import {TableNode} from "../node";

export const PltBodyCell = designComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object as PropType<PlcType>, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <td
                    colspan={props.plc.colspan}
                    rowspan={props.plc.rowspan}
                >
                    {props.node.data[props.plc.props.field!]}
                </td>
            )
        }
    },
})