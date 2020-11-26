import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {useRefs} from "../../use/useRefs";
import Input from '../input'
import {reactive, getCurrentInstance, watch} from 'vue';
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {ColorPickerServiceGetter} from "./service/color-picker.service";
import {isEffectiveColorString} from "./utils/ColorUtils";
import {getKey, KEY} from "../keyboard";
import './color-picker.scss'

const opacityBg = require('./sub/opacity.png')

export const ColorPicker = designComponent({
    name: 'pl-color-picker',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: String},                             // 当前颜色值
        enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
        format: {type: String, default: 'hex'},                 // 颜色格式
    },
    emits: {
        updateModelValue: (val: string | undefined) => true,
        blur: (e: Event) => true,
        focus: (e: Event) => true,
    },
    setup({props, event}) {

        useStyle()
        const ctx = getCurrentInstance()!
        const {refs} = useRefs({input: Input,})

        const state = reactive({
            val: props.modelValue,
            inputValue: props.modelValue,
        })

        const agentState = useEditPopperAgent({
            event,
            getAgent: () => ColorPickerServiceGetter(ctx.proxy!)({
                reference: () => refs.input as any,
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
                        refs.input!.methods.focus()
                    },
                }),
            })
        })

        const methods = {
            emitValue(val: any) {
                state.val = val
                event.emit.updateModelValue(val)
            },
        }

        const suffixIcon = () => (
            <div class="pl-color-picker-suffix" style={{backgroundImage: `url(${opacityBg})`}}>
                <div class="pl-color-picker-suffix-inner" style={{backgroundColor: state.val}}/>
            </div>
        )

        const handler = {
            inputChange: (val: string) => {
                state.inputValue = val
                if (isEffectiveColorString(val)) {
                    methods.emitValue(val)
                }
            },
            enter: () => {
                if (!!state.inputValue && state.inputValue !== state.val) {
                    alert('请输入有效的颜色值')
                    state.inputValue = state.val
                }
            },
            blur: (e: Event) => {
                agentState.state.focusCounter--
                if (agentState.state.focusCounter === 0) {
                    event.emit.blur(e)
                    agentState.methods.hide()
                    state.val = props.modelValue
                    state.inputValue = props.modelValue
                }
            },
            keydown: (e: KeyboardEvent) => {
                switch (getKey(e)) {
                    case KEY.enter:
                        agentState.handler.enter(e)
                        break
                    case KEY.esc:
                        agentState.handler.esc()
                        break
                }
            },
        }

        watch(() => props.modelValue, (val) => {
            state.val = val
            state.inputValue = val
        })

        return {
            render: () => (
                <pl-input ref="input"
                          class="pl-color-picker"
                          modelValue={state.inputValue}
                          suffixIcon={suffixIcon}
                          isFocus={agentState.state.focusCounter > 0}
                          {
                              ...{
                                  onClickInput: agentState.handler.clickInput,
                                  onChange: handler.inputChange,
                                  onKeydown: handler.keydown,
                                  onBlur: agentState.handler.blur,
                                  onFocus: agentState.handler.focus,
                              }
                          }
                />
            )
        }
    },
})