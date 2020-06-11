import {computed, defineComponent, inject} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";

export default defineComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object, required: true},
        rowData: {type: Object, required: true},
        fixed: {type: String, required: true},
    },
    setup(props) {

        const table = inject(TABLE_PROVIDER) as PlainTable

        const classes = computed(() => [
            'plt-body-cell',
            'plt-cell',
            ...getCellClass(props.plc as PlcType, props.rowData),
        ])

        const styles = computed(() => {
            const height = `${table.props.bodyRowHeight}px`
            const width = `${(props.plc as PlcType).props.width}px`
            return {
                height,
                width,
            }
        })

        const text = computed(() => {
            return props.rowData.row[props.plc.props.field!]
        })

        return () => {
            const plc = props.plc as PlcType
            if (props.fixed !== PlcFixedType.center && plc.props.fixed !== props.fixed) return null
            return (
                <td class={classes.value} colspan={1} rowspan={1} style={styles.value} title={text.value}>
                    {props.fixed === plc.props.fixed ? text.value : null}
                </td>
            )
        }
    },
})