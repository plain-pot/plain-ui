import {computed, defineComponent, getCurrentInstance, provide} from "@vue/composition-api";
import {getCellClass, stickyFlag} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table/TableNode";
import {PlcRender} from "@/packages/table/table/render";
import {injectTable} from "@/packages/table/table/table";
import {AssociateFieldsType, FormTrigger, TargetRule, validateAssociateFields, validateField} from "@/packages/form/validate";
import {EditProvider} from "@/use/useEdit";
import {useStyle} from "@/use/useStyle";
import {$plain} from "@/packages/base";
import {toArray} from "@/util/util";
import {Table} from "@/packages/table/table";

interface BodyCellPropsType {
    plc: PlcType,
    rowData: TableNode,
    isSummary: boolean
}

function validateFieldForCell(
    {
        rowData,
        changeField,
        allRules,
        associateFields,
    }: {
        rowData: TableNode,
        changeField: string,
        allRules: TargetRule[],
        associateFields: AssociateFieldsType | undefined,
    }
) {
    const {data, editRow, isEdit} = rowData
    const validateResult = rowData.validateResult || {}
    validateField(validateResult, allRules, isEdit ? editRow : data, changeField, FormTrigger.CHANGE).then(() => rowData.validateResult = validateResult)
    if (!!associateFields) {
        validateAssociateFields({
            changeFields: changeField,
            associateFields,
            next: field => validateField(validateResult, allRules, isEdit ? editRow : data, field, FormTrigger.ALL).then(() => rowData.validateResult = validateResult)
        })
    }
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
                const {allRules} = table.validateConfigData.value
                if (!!field && !!allRules && allRules.length > 0) {
                    validateFieldForCell({
                        rowData,
                        changeField: field,
                        allRules,
                        associateFields: table.props.associateFields,
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

        const span = !!table.props.spanMethod ? table.props.spanMethod({tableNode: props.rowData, plc: props.plc}) : {
            rowspan: 1,
            colspan: 1,
        }

        const cellStyles = computed(() => props.plc.styles.body.cell)
        const innerCellStyles = computed(() => {
            let styles = {...props.plc.styles.body.innerCell}
            if (span.rowspan > 1) {
                styles.height = `${table.propsState.bodyRowHeight * span.rowspan}px`
            }
            if (!!table.props.cellStyleFunc) {
                const cellStyles = table.props.cellStyleFunc(props.rowData, props.plc) || {}
                styles = {
                    ...styles,
                    ...cellStyles
                }
            }
            return styles
        })
        const cellClass = computed(() => {
            const classes = [
                ...props.plc.classes.body.cell,
                ...getCellClass(props.plc, props.rowData),
                {
                    'plt-cell-editing': renderData.value.editable,
                },
            ] as Table.Classes[]

            if (!!table.props.cellClassFunc) {
                const cellClasses = table.props.cellClassFunc(props.rowData, props.plc)
                if (!!cellClasses) {
                    classes.push(...toArray(cellClasses))
                }
            }

            return classes
        })
        const innerCellClass = computed(() => props.plc.classes.body.innerCell)

        return () => {

            if (span.rowspan === 0 || span.colspan === 0) {
                /*rowspan为0时，不会正确合并单元格，如果要合并单元格得不渲染这个td*/
                return null
            }

            const content = (
                <div style={innerCellStyles.value} class={innerCellClass.value}>
                    {/*{props.plc.isLastFixedLeft && 'isLastFixedLeft'}-{props.plc.isFirstFixedRight && 'isFirstFixedRight'}*/}
                    {renderData.value.body}
                </div>
            )

            if (cellStyles.value.position === 'sticky' && !stickyFlag && !table.props.disabledStickyCompatible) {
                const styles = {...cellStyles.value}
                delete styles.position
                delete styles[props.plc.props.fixed]

                return (
                    <pl-scroll-sticky
                        colspan={span.colspan}
                        rowspan={span.rowspan}
                        class={cellClass.value}
                        style={styles}
                        {...{
                            props: {
                                tag: 'td',
                                [props.plc.props.fixed]: Number($plain.utils.removePx(cellStyles.value[props.plc.props.fixed]!)),
                                zIndex: cellStyles.value.zIndex,
                            },
                        }}
                    >
                        {content}
                    </pl-scroll-sticky>
                )
            } else {
                return (
                    <td colspan={span.colspan}
                        rowspan={span.rowspan}
                        class={cellClass.value}
                        style={cellStyles.value}>
                        {content}
                    </td>
                )
            }
        }
    },
})