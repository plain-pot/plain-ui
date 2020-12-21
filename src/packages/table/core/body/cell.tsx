import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType, ComputedRef} from 'vue';
import {Plc} from "../../plc/core/plc.type";
import {TableNode} from "../useTableNode";
import {renderBodyCell} from "../../plc/core/render";
import {useEdit} from "../../../../use/useEdit";
import {StyleStatus, useStyle} from "../../../../use/useStyle";
import {FormValidate, FormValidateTrigger} from "../../../form/form.validate";

function useCellFormItemValidate(props: { plc: Plc, node: TableNode }, validate: ComputedRef<FormValidate>) {
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

        useCellFormItemValidate(props, props.table.formValidate)

        return {
            render: () => {
                const {body, editable} = renderBodyCell({node: props.node, plc: props.plc})
                const span = !!props.table.props.spanMethod ? props.table.props.spanMethod(props.node) : {rowspan: 1, colspan: 1}

                if (span.rowspan === 0 || span.colspan === 0) {
                    /*rowspan为0时，不会正确合并单元格，如果要合并单元格得不渲染这个td*/
                    return null
                }

                return (
                    <td
                        {...span}
                        class={[
                            props.plc.classes.body,
                            {
                                'plt-cell-editing': editable,
                            }
                        ]}
                        style={props.plc.styles.body as any}>
                        {body}
                    </td>
                )
            }
        }
    },
})