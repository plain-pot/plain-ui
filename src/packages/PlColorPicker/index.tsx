import {designComponent, PropType, useModel, useRefs, watch} from 'plain-ui-composition'
import './color-picker.scss'
import {EditProps} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {PlInput} from "../PlInput";
import PlColorButton from "../PlColorButton";
import {SimpleFunction} from "plain-ui-composition"
import {reactive} from "plain-ui-composition";
import {useEditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import useColorPicker from "../useColorPicker";

import {isEffectiveColorString} from "./utils/ColorUtils";
import $$notice from "../$$notice";
import PlPopper from "../PlPopper";

enum ColorPickerType {
    input = 'input',
    button = 'button',
}

export const PlColorPicker = designComponent({
    name: 'pl-color-picker',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: String},                             // 当前颜色值
        enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
        format: {type: String, default: 'hex'},                 // 颜色格式
        type: {type: String as PropType<keyof typeof ColorPickerType>, default: ColorPickerType.input},
        popperAttrs: {type: Object as PropType<Partial<typeof PlPopper.use.props>>},
    },
    scopeSlots: {
        default: (scope: { color: string, onClick: SimpleFunction }) => {},
    },
    inheritPropsType: PlInput,
    emits: {
        onUpdateModelValue: (val: string | undefined) => true,
        onBlur: (e: FocusEvent) => true,
        onFocus: (e: FocusEvent) => true,
    },
    setup({props, scopeSlots, event}) {

        useStyle()
        const {refs, onRef} = useRefs({
            input: PlInput,
            button: PlColorButton,
        })

        const model = useModel(() => props.modelValue, event.emit.onUpdateModelValue, {autoWatch: false})
        const state = reactive({
            val: model.value,
            inputValue: props.modelValue,
        })

        const agentState = useEditPopperAgent({
            event,
            serviceGetter: useColorPicker,
            option: {
                reference: () => refs.input?.refs.input || refs.button?.refs.el || scopedSlotsOnClick.el,
                renderAttrs: () => ({
                    modelValue: state.val,
                    enableAlpha: props.enableAlpha,
                    format: props.format,

                    onChange(val) {
                        state.inputValue = val
                        methods.emitValue(val)
                    },
                }),
                popperAttrs: () => ({
                    ...props.popperAttrs as any,
                    onMousedownPopper: async () => {
                        agentState.state.focusCounter++
                    },
                    onClickPopper: () => {
                        !!refs.input && refs.input.methods.focus()
                    },
                }),
            },
        })
        const scopedSlotsOnClick = (() => {
            const variable = {
                el: null as null | HTMLDivElement,
                onClick: (e: MouseEvent) => {
                    variable.el = e.target as HTMLDivElement
                    agentState.inputHandler.onClickInput()
                }
            }
            return variable
        })();

        const methods = {
            emitValue(val: any) {
                model.value = val
            },
        }

        const suffixIcon = () => (
            <PlColorButton
                ref={onRef.button}
                color={state.val}
                onClick={agentState.inputHandler.onClickInput}/>
        )

        const inputHandler = {
            onChange: (val: string) => {
                state.inputValue = val
                if (isEffectiveColorString(val)) {
                    methods.emitValue(val)
                }
            },
            /*---------------------------------------override-------------------------------------------*/

            onEnter: (e: KeyboardEvent) => {
                if (!!state.inputValue && state.inputValue !== state.val) {
                    $$notice.warn('请输入有效的颜色值')
                    state.inputValue = state.val
                }
                agentState.inputHandler.onEnter(e)
            },
            onBlur: (e: FocusEvent) => {
                agentState.state.focusCounter--
                if (agentState.state.focusCounter === 0) {
                    event.emit.onBlur(e)
                    agentState.methods.hide()
                    state.val = model.value
                    state.inputValue = model.value
                }
            },
        }

        watch(() => props.modelValue, (val) => {
            model.value = val
            state.val = val
            state.inputValue = val
        })

        return {
            render: () => {
                return scopeSlots.default({
                    color: state.val!,
                    onClick: scopedSlotsOnClick.onClick,
                }, (
                    props.type === ColorPickerType.input ? (
                        <PlInput
                            ref={onRef.input}
                            class="pl-color-picker"
                            modelValue={state.inputValue}
                            suffixIcon={suffixIcon}
                            placeholder={agentState.editComputed.value.placeholder!}
                            isFocus={agentState.state.focusCounter > 0}
                            {...{
                                ...agentState.inputHandler,
                                ...inputHandler,
                            }}/>
                    ) : suffixIcon()
                ))
            }
        }
    },
})

export default PlColorPicker
