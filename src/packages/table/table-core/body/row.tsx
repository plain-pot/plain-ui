import {designComponent} from "../../../../use/designComponent";
import {computed, PropType} from 'vue';
import {TableNode} from "../node";
import {PlainTable} from "../../table";
import {SingleClass} from "../../../../use/useClasses";
import {toArray} from "../../../../utils/toArray";
import {PltBodyCell} from "./body-cell";

export const PltRow = designComponent({
    name: 'plt-row',
    props: {
        node: {type: Object as PropType<TableNode>, required: true},
        table: {type: Object as PropType<PlainTable>, required: true}
    },
    setup({props}) {
        const table = props.table
        const handler = {
            click: (e: MouseEvent) => {table.handler.clickRow(e, props.node)},
            dblclick: (e: MouseEvent) => {table.handler.dblclickRow(e, props.node)},
        }
        const binding = computed(() => {

            const classes = [
                'plt-row',
                {
                    'plt-row-summary': props.node.isSummaryData,
                    'plt-row-current': !!table.state.current && table.state.current.key === props.node.key,
                }
            ] as SingleClass[]

            if (!!table.props.rowClassFunc) {
                const rowClass = table.props.rowClassFunc(props.node)
                if (!!rowClass) {
                    classes.push(...toArray(rowClass))
                }
            }

            return {
                class: classes,
                onClick: handler.click,
                onDblclick: handler.dblclick,
            }
        })

        return {
            render: () => (
                <tr {...binding.value}>
                    {table.bodyPlcList.map((plc, plcIndex) => (<PltBodyCell
                        table={table}
                        key={plcIndex}
                        plc={plc} node={props.node}
                    />))}
                </tr>
            )
        }
    },
})