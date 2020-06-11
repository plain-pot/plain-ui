import {computed, defineComponent, inject} from "@vue/composition-api";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";

export default defineComponent({
    name: 'plt-row',
    props: {
        rowData: {type: Object, required: true},
        fixed: {type: String, required: true},
    },
    setup(props) {

        const table = inject(TABLE_PROVIDER) as PlainTable

        const isHover = computed(() => {

        })

        const isCurrent = computed(() => {

        })

        const classes = computed(() => {

        })

        const handler = {
            mouseenter: () => {},
            click: () => {},
        }

        const binding = computed(() => {
            return {
                class: "plt-row",
                on: {
                    mouseenter: handler.mouseenter,
                    click: handler.click,
                }
            }
        })

        return () => (
            <tr {...binding.value}>
                {
                    table.bodyPlcList.value!.map((plc, plcIndex) => (<plt-body-cell key={plcIndex} plc={plc} rowData={props.rowData} fixed={props.fixed}/>))
                }
            </tr>
        )
    },
})