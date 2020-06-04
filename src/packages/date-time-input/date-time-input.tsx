import {computed, defineComponent} from "@vue/composition-api";
import {EditProps, useEdit} from "@/use/useEdit";
import {CompRef, useRefs} from "@/use/useRefs";
import {FormatPropsType, useProps} from "@/use/useProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {$plain} from "@/packages/base";
import {HTMLInputEvent} from "@/types/utils";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'pl-date-time-input',
    props: {
        ...EditProps,

        width: {type: [String, Number], default: 138},
        value: {type: String},

        displayFormat: {type: String},
    },
    setup(props) {

        const refs = useRefs({
            input: CompRef,
        })

        const {editComputed} = useEdit()

        const propsState = useProps(props, {
            width: FormatPropsType.number,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            blur: EmitFunc,
            focus: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input, false)

        const styles = computed(() => ({
            width: $plain.utils.suffixPx(propsState.width)
        }))

        const regexp = computed(() => {
            return new RegExp('^' + props.displayFormat!.replace(/[a-zA-Z]/g, '\\d') + '$')
        })

        const methods = {
            focus: () => {
                refs.input.methods.focus()
            }
        }

        const handler = {
            input: (e: HTMLInputEvent) => {
                model.value = e.target.value
                if (!model.value || regexp.value.test(model.value)) {
                    emit.input(model.value)
                }
            },
            blur: (e) => {
                model.value = props.value
                emit.blur(e)
            },
            focus: (e) => {
                emit.focus(e)
            },
        }

        useRefer({
            props,
            propsState,
            model,
            methods,
        })

        return () => (
            <input type="text"
                   ref="input"
                   class="pl-date-time-inner-input pl-input-custom-inner-input"
                   style={styles.value}
                   value={model.value}
                   onInput={handler.input}
                   onBlur={handler.blur}
                   onFocus={handler.focus}
                   disabled={editComputed.value.disabled}
                   readOnly={editComputed.value.readonly}
            />
        )
    },
})