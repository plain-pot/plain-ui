import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {TablePlc} from "../../plc/core/plc.type";
import {useHeadCellResize} from "./useHeadCellResize";
import {renderHeadCell} from "../../plc/core/render";
import {useColDraggier} from "./useColDraggier";
import {PlainScroll} from "../../../scroll/scroll";

export const PltHeadCell = designComponent({
    name: 'plt-head-cell',
    props: {
        table: {type: PlainTable, required: true},
        tablePlc: {type: Object as PropType<TablePlc>, required: true},
        scroll: {type: Function as PropType<() => PlainScroll>, required: true},
    },
    setup({props}) {

        const {resizeHandler} = useHeadCellResize(props.table, props.tablePlc)
        const {tdAttrs} = useColDraggier(() => ({
            table: props.table,
            plc: props.tablePlc,
            scrollRefer: props.scroll,
        }))

        return {
            render: () => {
                const content = renderHeadCell(props.tablePlc)
                return (
                    <td
                        class={[
                            props.tablePlc.classes.head,
                            !!props.table.props.headCellClassFunc ? props.table.props.headCellClassFunc(props.tablePlc) : null
                        ]}
                        style={{
                            ...props.tablePlc.styles.head as any,
                            ...(!!props.table.props.headCellStyleFunc ? props.table.props.headCellStyleFunc(props.tablePlc) : {})
                        }}
                        rowspan={props.tablePlc.rowspan}
                        colspan={props.tablePlc.colspan}
                        {...tdAttrs}
                    >
                        {content}
                        <span class="plt-head-cell-indicator" onMousedown={resizeHandler.mousedown}/>
                    </td>
                )
            }
        }
    },
})