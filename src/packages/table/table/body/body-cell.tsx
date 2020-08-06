import {computed, defineComponent, getCurrentInstance, inject, provide} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {TableNode} from "@/packages/table/table/TableNode";
import {PlcRender} from "@/packages/table/table/render";
import {EditProvider} from "@/use/useEdit";
import {FormTrigger, validateField} from "@/packages/form/validate";
import {useStyle} from "@/use/useStyle";

interface BodyCellPropsType {
    plc: PlcType,
    rowData: TableNode,
    fixed: PlcFixedType,
    isSummary: boolean
}

function useFormItemEdit(props: BodyCellPropsType, table: PlainTable): void {
    const editComputed = computed(() => {
        return {
            disabled: null,
            readonly: null,
            loading: null,
            editable: true,
            onBlur: () => {
                // console.log('blur', props.plc.props.field)
            },
            onChange: () => {
                // console.log('change', props.plc.props.field)
                const {rowData, plc: {props: {field}}} = props
                if (!!field) {
                    const {data, editRow, isEdit} = rowData
                    const validateResult = rowData.validateResult || {}
                    validateField(validateResult, table.validateConfigData.value.allRules, isEdit ? editRow : data, field!, FormTrigger.CHANGE).then(ret => {
                        rowData.validateResult = validateResult
                    })
                }
            }
        }
    })
    provide(EditProvider, editComputed)
}

export default defineComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object, required: true},
        rowData: {type: TableNode, required: true},
        fixed: {type: String, required: true},
        isSummary: {type: Boolean},
    },
    setup(props: BodyCellPropsType) {

        const table = inject(TABLE_PROVIDER) as PlainTable
        const ctx = getCurrentInstance()!
        useFormItemEdit(props, table)

        const {styleComputed} = useStyle({shape: 'none', size: 'mini'})

        const renderData = computed(() => PlcRender.body({
            ...props,
            h: ctx.$createElement,
            ctx,
        }))

        const classes = computed(() => {
            return [
                'plt-body-cell',
                'plt-cell',
                ...getCellClass(props.plc, props.rowData),
                {
                    'plt-cell-editing': renderData.value.editable
                }
            ]
        })

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
                        {renderData.value.body}
                    </div>
                </td>
            )
        }
    },
})