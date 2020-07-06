import {computed, defineComponent, getCurrentInstance, inject} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {TableNode} from "@/packages/table/table/TableNode";
import {PlcRender} from "@/packages/table/table/render";

export default defineComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object, required: true},
        rowData: {type: TableNode, required: true},
        fixed: {type: String, required: true},
        isSummary: {type: Boolean},
    },
    setup(props: { plc: PlcType, rowData: TableNode, fixed: PlcFixedType, isSummary: boolean }) {

        const table = inject(TABLE_PROVIDER) as PlainTable
        const {$createElement} = getCurrentInstance()!

        const classes = computed(() => [
            'plt-body-cell',
            'plt-cell',
            ...getCellClass(props.plc, props.rowData),
        ])

        const styles = computed(() => {
            const height = `${table.props.bodyRowHeight}px`
            const width = `${(props.plc).props.width}px`
            return {
                height,
                width,
            }
        })

        const text = computed(() => {
            return !!props.plc.props.field ? props.rowData.data[props.plc.props.field] : null
        })

        return () => {
            if (props.fixed !== PlcFixedType.center && props.plc.props.fixed !== props.fixed) return null

            return (
                <td colspan={1} rowspan={1}>
                    <div class={classes.value} style={styles.value} title={text.value}>
                        {PlcRender.body({
                            ...props,
                            h: $createElement,
                        })}
                    </div>
                </td>
            )
        }
    },
})