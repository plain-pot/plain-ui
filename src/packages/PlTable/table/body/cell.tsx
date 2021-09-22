import {tPlc} from "../../plc/utils/plc.type";
import {TableNode} from "../use/useTableNode";
import {useEdit} from "../../../../use/useEdit";
import {StyleStatus, useStyle} from "../../../../use/useStyle";
import {ComputedRef, designComponent, PropType, useClasses, useStyles} from "plain-ui-composition";
import {FormAssociateFields, FormValidateTrigger, tFormRuleData} from "../../../PlForm/form.validate";
import {PlainTable} from "../../index";
import {renderBodyCell} from "../../plc/utils/render";


function useCellFormItemValidate(props: { plc: tPlc, node: TableNode }, formRuleData: ComputedRef<tFormRuleData>, associateFields?: FormAssociateFields) {
    const handler = {
        validateChange: async (trigger: FormValidateTrigger) => {
            let {plc: {props: {field}}, node} = props
            const {edit, data, editRow, validateErrors} = node
            if (!field) {return}
            const {fitRuleList, fitRuleMap} = formRuleData.value.methods.getRules({
                field,
                trigger,
                associateFields,
            })
            if (fitRuleList.length === 0) {return}

            node.validateErrors = await formRuleData.value.methods.validateField({
                rules: fitRuleMap,
                formData: edit ? editRow : data,
                allErrors: validateErrors || [],
            })
        },
        onEditChange: async () => {
            await handler.validateChange(FormValidateTrigger.change)
        },
        onEditBlur: async () => {
            await handler.validateChange(FormValidateTrigger.blur)
        },
    }
    useEdit({
        adjust: ret => {
            ret.disabled = null
            ret.readonly = null
            ret.loading = null
            ret.onChange = handler.onEditChange
            ret.onBlur = handler.onEditBlur
        }
    })
    useStyle({
        adjust: (ret) => {
            const {node: {validateErrors}, plc: {props: {field}}} = props
            const {status} = ret
            const inValid = (() => {
                if (!validateErrors) {return false}
                const error = validateErrors.find(i => i.field === field)
                return !!error
            })()
            ret.status = status || (inValid ? StyleStatus.error : undefined)
            return ret
        }
    })
}

export const PltCell = designComponent({
    name: 'plt-cell',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        plc: {type: Object as PropType<tPlc>, required: true},
    },
    setup({props}) {

        useCellFormItemValidate(props, props.table.formValidate, props.table.props.associateFields)

        const onClick = (e: MouseEvent) => {
            props.plc.event.emit.onClick({e, scope: {row: props.node.data, node: props.node, plc: props.plc}})
        }

        return {
            render: () => {
                const {node, plc} = props
                const {body, editable} = renderBodyCell({node, plc, formEdit: false})
                const span = !!props.table.props.spanMethod ? props.table.props.spanMethod({node, plc}) : {rowspan: 1, colspan: 1}

                if (span.rowspan === 0 || span.colspan === 0) {
                    /*rowspan为0时，不会正确合并单元格，如果要合并单元格得不渲染这个td*/
                    return null
                }
                const classes = useClasses(() => {
                    const ret = [
                        props.plc.classes.body,
                        props.plc.props.bodyCls,
                        {
                            'plt-cell-editing': editable,
                            'plt-cell-link': plc.props.link,
                        }
                    ] as any[]
                    if (!!props.table.props.cellClassFunc) {
                        ret.push(props.table.props.cellClassFunc(node, plc))
                    }
                    return ret
                })
                const styles = useStyles(style => {
                    Object.assign(style, plc.styles.body)
                    if (!!props.table.props.cellStyleFunc) {
                        Object.assign(style, props.table.props.cellStyleFunc(node, plc))
                    }
                })

                return (
                    <td
                        rowSpan={span.rowspan}
                        colSpan={span.colspan}
                        class={classes.value}
                        style={styles.value}
                        onClick={onClick}>
                        {body}
                    </td>
                )
            }
        }
    },
})
