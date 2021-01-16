import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {useRefs} from "../../use/useRefs";
import Input from '../input'
import {reactive, watch, PropType} from 'vue';
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {ColorPickerServiceGetter} from "./service/color-picker.service";
import {isEffectiveColorString} from "./utils/ColorUtils";
import './color-picker.scss'
import {useModel} from "../../use/useModel";
import {$$notice} from "../notice-service";
import {useScopedSlots} from "../../use/useScopedSlots";
import {PlColorButton} from "./color-button";

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
        type: {type: String as PropType<ColorPickerType>, default: ColorPickerType.input}
    },
    emits: {
        onUpdateModelValue: (val: string | undefined) => true,
        onBlur: (e: Event) => true,
        onFocus: (e: Event) => true,
    },
    setup({props, event}) {

        useStyle()
        const {refs} = useRefs({
            input: Input,
            button: PlColorButton,
        })
        const {scopedSlots} = useScopedSlots({
            default: {color: String, onClick: Function as PropType<() => void>},
        }, true)

        const model = useModel(() => props.modelValue, event.emit.onUpdateModelValue, {autoWatch: false})
        const state = reactive({
            val: model.value,
            inputValue: props.modelValue,
        })

        const agentState = useEditPopperAgent({
            event,
            serviceGetter: ColorPickerServiceGetter,
            option: {
                reference: () => refs.input as any || refs.button || scopedSlotsOnClick.el,
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
                ref="button"
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
            onBlur: (e: Event) => {
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
                return scopedSlots.default({
                    color: state.val!,
                    onClick: scopedSlotsOnClick.onClick,
                }, (
                    props.type === ColorPickerType.input ? (
                        <pl-input ref="input"
                                  class="pl-color-picker"
                                  modelValue={state.inputValue}
                                  suffixIcon={suffixIcon}
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