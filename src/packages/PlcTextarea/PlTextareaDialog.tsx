import {designComponent, useModel} from "plain-ui-composition";

import {EditProps, useEdit} from "../../use/useEdit";
import PlInput from "../PlInput";
import useDialog from "../useDialog";

export const PlTextareDialog = designComponent({
    name: 'pl-textarea-dialog',
    props: {
        ...EditProps,
        modelValue: {type: [String, Number] as any},
    },
    emits: {
        onUpdateModelValue: (val?: any) => true,
    },
    setup({props, event: {emit}}) {

        const $dialog = useDialog()
        const {editComputed} = useEdit()

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const onClick = () => {
            if (!editComputed.value.editable) {return}
            $dialog({
                editType: 'textarea',
                editValue: model.value,
                confirmButton: true,
                cancelButton: true,
                onConfirm: (val) => {
                    model.value = val
                }
            })
        }

        return () => <PlInput modelValue={model.value} readonly onClick={onClick}/>
    },
})
