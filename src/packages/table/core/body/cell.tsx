import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {ComputedRef, PropType} from 'vue';
import {Plc} from "../../plc/core/plc.type";
import {TableNode} from "../useTableNode";
import {renderBodyCell} from "../../plc/core/render";
import {useEdit} from "../../../../use/useEdit";
import {StyleStatus, useStyle} from "../../../../use/useStyle";
import {FormAssociateFields, FormValidate, FormValidateTrigger} from "../../../form/form.validate";
import {useClass} from "../../../../use/useClasses";
import {useStyles} from "../../../../use/useStyles";

function useCellFormItemValidate(props: { plc: Plc, node: TableNode }, validate: ComputedRef<FormValidate>, associateFields?: FormAssociateFields) {
    const handler = {
        onEditChange: async () => {
            let {plc: {props: {field}}, node: {edit, data, editRow, validateResultMap}} = props
            if (!validateResultMap) {props.node.validateResultMap = validateResultMap = {}}
            if (!field) {return}
            await validate.value.methods.validateField({
                field,
                formData: edit ? editRow : data,
                trigger: FormValidateTrigger.change,
                formValidateResultMap: validateResultMap,
                associateFields,
            })
        },
        onEditBlur: async () => {
            let {plc: {props: {field}}, node: {edit, data, editRow, validateResultMap}} = props
            if (!validateResultMap) {props.node.validateResultMap = validateResultMap = {}}
            if (!field) {return}
            await validate.value.methods.validateField({
                field,
                formData: edit ? editRow : data,
                trigger: FormValidateTrigger.blur,
                formValidateResultMap: validateResultMap,
                associateFields,
            })
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
            const {node: {validateResultMap}, plc: {props: {field}}} = props
            const {status} = ret
            ret.status = status || ((!!field && validateResultMap && !!validateResultMap[field]) ? StyleStatus.error : undefined)
            return ret
        }
    })
}

export const PltCell = designComponent({
    name: 'plt-cell',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        plc: {type: Object as PropType<Plc>, required: true},
    },
    setup({props}) {

        useCellFormItemValidate(props, props.table.formValidate, props.table.props.associateFields)

        return {
            render: () => {
                const {node, plc} = props
                const {body, editable} = renderBodyCell({node, plc})
                const span = !!props.table.props.spanMethod ? props.table.props.spanMethod({node, plc}) : {rowspan: 1, colspan: 1}

                if (span.rowspan === 0 || span.colspan === 0) {
                    /*rowspan为0时，不会正确合并单元格，如果要合并单元格得不渲染这个td*/
                    return null
                }
                const classes = useClass(() => {
                    const ret = [
                        props.plc.classes.body,
                        props.plc.props.bodyCls,
                        {'plt-cell-editing': editable,}
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
                    <td{...span} class={classes.value} style={styles.value}>
                        {body}
                    </td>
                )
            }
        }
    },
})