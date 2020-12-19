import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {TablePlc} from "../../plc/core/plc.type";
import {useHeadCellResize} from "./useHeadCellResize";

export const PltHeadCell = designComponent({
    name: 'plt-head-cell',
    props: {
        table: {type: PlainTable, required: true},
        tablePlc: {type: Object as PropType<TablePlc>, required: true},
    },
    setup({props}) {

        const {resizeHandler} = useHeadCellResize(props.table, props.tablePlc)

        return {
            render: () => {
                return (
                    <td class={props.tablePlc.classes.head}
                        style={props.tablePlc.styles.head as any}
                        rowspan={props.tablePlc.rowspan}
                        colspan={props.tablePlc.colspan}>
                        {props.tablePlc.props.title}
                        <span class="plt-head-cell-indicator" onMousedown={resizeHandler.mousedown}/>
                    </td>
                )
            }
        }
    },
})