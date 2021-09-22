import useDialog from "../../useDialog";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {cloneTableNode} from "../utils/cloneTableNode";

import {tPlc} from "../../PlTable/plc/utils/plc.type";
import PlForm from "../../PlForm";
import PlFormItem from "../../PlFormItem";
import {renderBodyCell} from "../../PlTable/plc/utils/render";
import {tFormPropRules} from "../../PlForm/form.validate";
import {reactive, useRefs} from "plain-ui-composition";
import {deepcopy} from "plain-utils/object/deepcopy";

export function useTableOptionEditForm() {
    const $dialog = useDialog()
    const {refs, onRef} = useRefs({form: PlForm})

    const edit = ({node, title, plcList, onConfirm, onCancel, rules}: {
        node: TableNode,
        title: string,
        plcList: tPlc[],
        onConfirm: (node: TableNode) => void,
        onCancel?: () => void,
        rules?: tFormPropRules,
    }) => {
        node = reactive(cloneTableNode(node))
        node.edit = true
        node.editRow = deepcopy(node.data)

        const dialog = $dialog({
            status: null,
            dialogProps: {
                // contentPadding:false,
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                // destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
            },
            title,
            render() {
                return (
                    <PlForm
                        ref={onRef.form}
                        column={1}
                        modelValue={node.editRow}
                        rules={rules}
                    >
                        {plcList.filter(i => !i.props.hideInForm).map((plc, index) => (
                            <PlFormItem
                                key={index}
                                label={plc.props.title}
                                required={plc.props.required}
                                rules={plc.props.rules}
                                field={plc.props.field}>
                                {renderBodyCell({node, plc, formEdit: true}).body}
                            </PlFormItem>
                        ))}
                    </PlForm>
                )
            },
            onConfirm: async () => {
                await refs.form!.validate()
                dialog.close()
                onConfirm(node)
            },
            onCancel: () => {
                dialog.close()
                !!onCancel && onCancel()
            },
            confirmButton: true,
            cancelButton: true,
        })
    }

    return {
        edit,
    }
}
