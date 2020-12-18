import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {TablePlc} from "../../plc/core/plc.type";

export const PltHeadCell = designComponent({
    name: 'plt-head-cell',
    props: {
        table: {type: PlainTable, required: true},
        tablePlc: {type: Object as PropType<TablePlc>, required: true},
    },
    setup({props}) {
        return {
            render: () => {
                return (
                    <td>
                        {props.tablePlc.props.title}
                    </td>
                )
            }
        }
    },
})