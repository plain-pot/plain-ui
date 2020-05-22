import {defineComponent, reactive, watch} from "@vue/composition-api";
import {EditProps} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {$plain} from "@/packages/base";
import {CompRef, ElRef, useRefs} from "@/use/useRefs";
import {isEffectiveColorString} from "@/packages/color-picker/color/ColorUtils";
import {getKey, KEY} from "@/packages/keyboard";

const opacityBg = require('./sub/opacity.png')

export default defineComponent({
    name: 'pl-color-picker',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: String},                                  // 当前颜色值
        enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
        format: {type: String, default: 'hex'},                 // 颜色格式
    },
    setup(props) {

        useStyle()

        const refs = useRefs({
            el: ElRef,
            input: CompRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            blur: EmitFunc,
            focus: EmitFunc,
        })

        const state = reactive({
            val: props.value,
            inputValue: props.value,

        })

        const agentState = usePopperAgentEditor(() => ($plain as any).$cs(() => ({
            props: {
                value: state.val,
                enableAlpha: props.enableAlpha,
                format: props.format,
            },
            popperProps: {
                reference: refs.el,
            },
            listener: {
                change: (val) => {
                    state.inputValue = val
                    methods.emitValue(val)
                },
            },
            popperListener: {
                'mousedown-popper': async () => {
                    agentState.state.focusCounter++
                },
                'click-popper': () => {
                    refs.input.methods.focus()
                },
            }
        })))

        const methods = {
            emitValue(val) {
                state.val = val
                emit.input(val)
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
                    $plain.$message('请输入有效的颜色值')
                    state.inputValue = state.val
                }
            },
            blur: () => {
                agentState.state.focusCounter--
                if (agentState.state.focusCounter === 0) {
                    emit.blur()
                    agentState.methods.hide()
                    state.val = props.value
                    state.inputValue = props.value
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

        watch(() => props.value, (val) => {
            state.val = val
            state.inputValue = val
        },)

        return () => (
            <pl-input ref="input"
                      class="pl-color-picker"
                      value={state.inputValue}
                      suffixIcon={suffixIcon}
                      isFocus={agentState.state.focusCounter > 0}

                      {
                          ...{
                              on: {
                                  'click-input': agentState.handler.clickInput,
                                  change: handler.inputChange,
                                  keydown: handler.keydown,
                                  blur: agentState.handler.blur,
                                  focus: agentState.handler.focus,
                              }
                          }
                      }
            />
        )
    },
})