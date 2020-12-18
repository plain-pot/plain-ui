import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {SimpleObject} from "../../../../shims";
import {Plc} from "../../plc/core/plc.type";

export const PltCell = designComponent({
    name: 'plt-cell',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<SimpleObject>, required: true},
        plc: {type: Object as PropType<Plc>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <td>
                    {props.node[props.plc.props.field!]}
                </td>
            )
        }
    },
})