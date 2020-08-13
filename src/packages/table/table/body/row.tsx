import {computed, defineComponent} from "@vue/composition-api";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {injectTable} from "@/packages/table/table/table";

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
            return {
                class: 'plt-row',
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