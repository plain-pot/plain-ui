import {computed, defineComponent} from "@vue/composition-api";
import {TableNode} from "@/packages/table/table/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {toArray} from "@/util/util";
import {Table} from "@/packages/table/table";

export default defineComponent({
    name: 'plt-row',
    props: {
        rowData: {type: TableNode, required: true},
        isSummary: {type: Boolean},
    },
    setup(props) {

        const table = injectTable()

        const handler = {
            click: (e: MouseEvent) => {table.handler.clickRow(e, props.rowData)},
            dblclick: (e: MouseEvent) => {table.handler.dblclickRow(e, props.rowData)},
        }

        const binding = computed(() => {

            const classes = [
                'plt-row',
                {
                    'plt-row-summary': props.isSummary,
                    'plt-row-current': !!table.state.current && table.state.current.key === props.rowData.key,
                }
            ] as Table.Classes[]

            if (!!table.props.rowClassFunc) {
                const rowClass = table.props.rowClassFunc(props.rowData)
                if (!!rowClass) {
                    classes.push(...toArray(rowClass))
                }
            }

            return {
                class: classes,
                on: {
                    click: handler.click,
                    dblclick: handler.dblclick,
                }
            }
        })

        return () => (
            <tr {...binding.value}>
                {
                    table.bodyPlcList.value!.map((plc, plcIndex) => (<plt-body-cell key={plcIndex} plc={plc} rowData={props.rowData} isSummary={props.isSummary}/>))
                }
            </tr>
        )
    },
})