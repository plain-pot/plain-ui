import {tPlcType} from "../../plc/utils/plc.type";
import {useHeadCellResize} from "./useHeadCellResize";
import {renderHeadCell} from "../../plc/utils/render";
import {useColDraggier} from "./useColDraggier";
import {computed, designComponent, PropType} from "plain-ui-composition";
import {PlainTable} from "../../index";
import {PlainScroll} from "../../../PlScroll";
import PlIcon from "../../../PlIcon";
import {toArray} from "plain-utils/utils/toArray";
import {classnames} from "plain-utils/dom/classnames";

export const PltHeadCell = designComponent({
    name: 'plt-head-cell',
    props: {
        table: {type: PlainTable, required: true},
        tablePlc: {type: Object as PropType<tPlcType>, required: true},
        scroll: {type: Function as PropType<() => PlainScroll>, required: true},
    },
    setup({props}) {

        const {resizeHandler} = useHeadCellResize(props.table, props.tablePlc)
        const {tdAttrs} = useColDraggier(computed(() => ({
            table: props.table,
            plc: props.tablePlc,
            scrollRefer: props.scroll,
        })))

        const sort = computed(() => {
            const {tablePlc, table} = props
            if (!table.props.sort) {return null}
            if (tablePlc.group) {return null}
            const sortObj = toArray(props.table.props.sort!).find(i => i.field === tablePlc.props.field)
            if (!sortObj) {return null}
            return !!sortObj.desc
        })

        return {
            render: () => {
                const content = renderHeadCell(props.tablePlc)
                return (
                    <td
                        class={classnames([
                            props.tablePlc.classes.head,
                            props.tablePlc.props.headCls,
                            !!props.table.props.headCellClassFunc ? props.table.props.headCellClassFunc(props.tablePlc) : null
                        ] as any)}
                        style={{
                            ...props.tablePlc.styles.head as any,
                            ...(!!props.table.props.headCellStyleFunc ? props.table.props.headCellStyleFunc(props.tablePlc) : {})
                        }}
                        rowspan={props.tablePlc.rowspan}
                        colspan={props.tablePlc.colspan}
                        onClick={e => props.table.event.emit.onClickHead(props.tablePlc, e)}
                        {...tdAttrs}
                    >
                        {content}
                        <span class="plt-head-cell-indicator" onMousedown={resizeHandler.mousedown}/>
                        {sort.value != null && (
                            <div class={`plt-head-cell-sorter plt-head-cell-sorter-${sort.value ? 'desc' : 'asc'}`}>
                                <div class="plt-head-cell-sorter-inner">
                                    <PlIcon icon="el-icon-caret-top"/>
                                    <PlIcon icon="el-icon-caret-bottom"/>
                                </div>
                            </div>
                        )}
                    </td>
                )
            }
        }
    },
})
