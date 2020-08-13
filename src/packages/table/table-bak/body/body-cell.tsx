import {computed, defineComponent, getCurrentInstance, inject, provide} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table-bak/table";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {PlcRender} from "@/packages/table/table-bak/render";
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

        useStyle({
            shape: 'none',
            size: 'mini',
            adjust: (result) => {
                const {validateResult} = props.rowData
                const {status} = result
                result.status = status != null ? status : (!!props.plc.props.field && !!validateResult && validateResult[props.plc.props.field] != null ? 'error' : (status || null))

                return result
            }
        })

        const renderData = computed(() => PlcRender.body({
            ...props,
            ctx,
        }))

        const classes = computed(() => {
            return [
                'plt-body-cell',
                'plt-cell',
                ...getCellClass(props.plc, props.rowData),
                {
                    'plt-cell-add-edit-padding': props.plc.props.addEditPadding,
                    'plt-cell-editing': renderData.value.editable,
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