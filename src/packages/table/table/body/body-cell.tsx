import {computed, defineComponent, getCurrentInstance, provide} from "@vue/composition-api";
import {getCellClass} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {PlcRender} from "@/packages/table/table-bak/render";
import {injectTable} from "@/packages/table/table/table";
import {getCellStyles} from "@/packages/table/plc/plc-fixed";
import {FormTrigger, validateField} from "@/packages/form/validate";
import {EditProvider} from "@/use/useEdit";
import {useStyle} from "@/use/useStyle";

interface BodyCellPropsType {
    plc: PlcType,
    rowData: TableNode,
    isSummary: boolean
}

function useFormItemEdit(props: BodyCellPropsType, table: ReturnType<typeof injectTable>): void {
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

        const table = injectTable()
        const ctx = getCurrentInstance()!
        useFormItemEdit(props, table)

        const renderData = computed(() => PlcRender.body({
            ...props,
            ctx,
        }))

        const cellClass = computed(() => {
            return [
                'plt-cell',
                'plt-body-cell',
                ...getCellClass(props.plc, props.rowData),
                {
                    'plt-cell-add-edit-padding': props.plc.props.addEditPadding,
                    'plt-cell-editing': renderData.value.editable,
                },
                {
                    'plt-cell-last-fixed-left': props.plc.isLastFixedLeft,
                    'plt-cell-first-fixed-right': props.plc.isFirstFixedRight,
                }
            ]
        })

        const cellStyles = computed(() => getCellStyles(props.plc, styles => {
            styles.height = `${table.propsState.bodyRowHeight}px`
            return styles
        }))

        const innerCellStyles = computed(() => ({
            width: `${(props.plc).props.width}px`,
        }))

        return () => {
            return (
                <td colspan={1}
                    rowspan={1}
                    class={cellClass.value}
                    style={cellStyles.value}
                >
                    <div style={innerCellStyles.value}>
                        {/*{props.plc.isLastFixedLeft && 'isLastFixedLeft'}-{props.plc.isFirstFixedRight && 'isFirstFixedRight'}*/}
                        {renderData.value.body}
                    </div>
                </td>
            )
        }
    },
})