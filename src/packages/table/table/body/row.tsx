import {computed, defineComponent, inject} from "@vue/composition-api";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {TableNode} from "@/packages/table/table/TableNode";

export default defineComponent({
    name: 'plt-row',
    props: {
        rowData: {type: TableNode, required: true},
        fixed: {type: String, required: true},
        isSummary: {type: Boolean},
    },
    setup(props) {

        const table = inject(TABLE_PROVIDER) as PlainTable

        const isHover = computed(() => table.utils.isHover(props.rowData))

        const isCurrent = computed(() => table.utils.isCurrent(props.rowData))

        const classes = computed(() => ([
            'plt-row',
            {
                'plt-row-hover': isHover.value,
                'plt-row-current': isCurrent.value,
            }
        ]))

        const handler = {
            mouseenter: () => {table.handler.hoverRow(props.rowData)},
            click: () => {table.handler.clickRow(props.rowData)},
            dblclick: () => {table.handler.dblclickRow(props.rowData)},
        }

        const binding = computed(() => {
            return {
                class: classes.value,
                on: {
                    mouseenter: handler.mouseenter,
                    click: handler.click,
                    dblclick: handler.dblclick,
                }
            }
        })

        return () => (
            <tr {...binding.value}>
                {
                    table.bodyPlcList.value!.map((plc, plcIndex) => (<plt-body-cell key={plcIndex} plc={plc} rowData={props.rowData} fixed={props.fixed} isSummary={props.isSummary}/>))
                }
            </tr>
        )
    },
})