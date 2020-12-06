import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from "../../use/useEdit";
import {useRefs} from "../../use/useRefs";
import {useNumber} from "../../use/useNumber";
import {useModel} from "../../use/useModel";
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';
import {computed} from 'vue';
import {HTMLInputEvent} from "../../shims";

export default designComponent({
    name: 'pl-date-time-input',
    props: {
        ...EditProps,
        width: {type: [String, Number], default: 138},
        modelValue: {type: String},
        displayFormat: {type: String},
    },
    emits: {
        updateModelValue: (val?: string) => true,
        focus: (e: Event) => true,
        blur: (e: Event) => true,
    },
    setup({props, event: {emit}}) {

        const {refs} = useRefs({
            input: HTMLInputElement,
        })

        const {editComputed} = useEdit()

        const {numberState} = useNumber(props, ['width'])

        const model = useModel(() => props.modelValue, emit.updateModelValue, {autoEmit: false})

        const styles = useStyles(style => {style.width = unit(numberState.width)})

        const regexp = computed(() => new RegExp('^' + props.displayFormat!.replace(/[a-zA-Z]/g, '\\d') + '$'))

        const methods = {
            focus: () => {
                refs.input.focus()
            }
        }

        const handler = {
            input: (e: HTMLInputEvent) => {
                model.value = e.target.value
                if (!model.value || regexp.value.test(model.value)) {
                    emit.updateModelValue(model.value)
                }
            },
            blur: (e: Event) => {
                model.value = props.modelValue
                emit.blur(e)
            },
            focus: (e: Event) => {
                emit.focus(e)
            },
        }


        return {
            refer: {
                refs,
                methods,
            },
            render: () => (
                <input type="text"
                       ref="input"
                       class="pl-date-time-inner-input pl-input-custom-inner-input"
                       style={styles.value}
                       value={model.value}
                       onInput={handler.input as any}
                       onBlur={handler.blur}
                       onFocus={handler.focus}
                       disabled={editComputed.value.disabled as any}
                       readonly={editComputed.value.readonly as any}
                />
            )
        }
    },
})