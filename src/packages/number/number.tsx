import {computed, defineComponent, reactive} from "@vue/composition-api";
import ClickWave from "@/directives/click-wave";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useListener} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";

import {HTMLInputEvent} from "@/types/utils";
import {getKey, KEY} from "@/packages/keyboard";

const NAN = 'NAN'

export default defineComponent({
    name: 'pl-number',
    directives: {ClickWave},
    props: {
        ...StyleProps,
        ...EditProps,

        value: {type: [String, Object]},                            // 双向绑定值
        min: {type: [String, Number]},                              // 最小值
        max: {type: [String, Number]},                              // 最大值
        step: {type: [String, Number], default: 1},                 // 计数器步长
        stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
        precision: {type: Number},                                  // 数值精度
        hideButton: {type: Boolean},                                // 隐藏操作按钮

        /*---------------------------------------input-------------------------------------------*/
        inputProps: {type: Object},                                 // pl-input属性配置对象
    },
    setup(props, context) {

        /*---------------------------------------emit-------------------------------------------*/

        const {emit} = useListener(context, {
            focus: EmitFunc,
            blur: EmitFunc,
            input: EmitFunc,
            enter: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.value, emit.input, false)

        useStyle({status: undefined})
        const {editComputed} = useEdit()

        const state = reactive({
            isFocus: false,                     // 当前是否获取焦点
            interval: null,                     // 进步器长摁定时器
        } as {
            isFocus: boolean,
            interval: null | number,
        })

        const propsState = useProps(props, {
            min: FormatPropsType.number,
            max: FormatPropsType.number,
            step: FormatPropsType.number,
            precision: FormatPropsType.number,
        })

        /*---------------------------------------utils-------------------------------------------*/

        const getValue: (val: any) => (null | number | 'NAN') = (val) => {
            if (val == null) return null
            val = String(val).trim()
            if (val === '') return null
            val = Number(val)
            if (isNaN(val)) {
                return NAN
            } else {
                return val
            }
        }
        const getEffectiveValue: () => number | null = () => {
            let value = formatModelValue.value
            if (value === NAN) {
                value = formatValue.value
                if (value === NAN) {
                    if (propsState.min != null) return propsState.min
                    else if (propsState.max != null) return propsState.max
                    else if (props.stepStrictly) return propsState.step
                    else return 0
                }
            }
            return value
        }
        const checkValue: (value: number | null) => number | null = (value) => {
            if (value != null) {
                // min
                if (propsState.min != null && value < propsState.min) {
                    value = propsState.min
                }
                // max
                if (propsState.max != null && value! > propsState.max) {
                    value = propsState.max
                }
                // stepStrictly
                if (props.stepStrictly && value! % propsState.step !== 0) {
                    console.log('props.value', props.value)
                    value = props.value
                }
                // precision
                if (propsState.precision != null) {
                    value = Number(value!.toFixed(propsState.precision))
                }
            }
            return value
        }

        const utils = {
            getValue,
            getEffectiveValue,
            checkValue,
        }

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => ([
            `pl-number`,
            {
                'pl-number-hide-button': props.hideButton,
                'pl-number-disabled': editComputed.value.disabled,
            }
        ]))
        const formatModelValue = computed(() => utils.getValue(model.value))
        const formatValue = computed(() => utils.getValue(props.value))

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            add: () => {
                if (!editComputed.value.editable) {
                    return
                }
                let value = utils.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value += propsState.step
                value = utils.checkValue(value)
                model.value = value
                emit.input(model.value)
            },
            minus: () => {
                if (!editComputed.value.editable) {
                    return
                }
                let value = utils.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value -= propsState.step
                value = utils.checkValue(value)
                model.value = value
                emit.input(model.value)
            },
            clearInterval: () => {              // 清除定时器
                if (state.interval != null) {
                    clearInterval(state.interval)
                }
                window.removeEventListener('mouseup', methods.clearInterval)
            }
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            focus: (e) => {
                state.isFocus = true
                emit.focus(e)
            },
            blur: (e) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.input(model.value)
                state.isFocus = false
                emit.blur(e)
            },
            input: (e: HTMLInputEvent) => {
                model.value = e.target.value
            },
            enter: (e: KeyboardEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.input(model.value)
                emit.enter(e)
            },
            intervalAdd: () => {
                methods.add()
                state.interval = setInterval(methods.add, 100)
                window.addEventListener('mouseup', methods.clearInterval)
            },
            intervalMinus: () => {
                methods.minus()
                state.interval = setInterval(() => methods.minus(), 100)
                window.addEventListener('mouseup', methods.clearInterval)
            },
            clearHandler: () => {
                model.value = null
                emit.input(model.value)
            },
            keydown: (e: KeyboardEvent) => {
                if (getKey(e) === KEY.up) {
                    e.preventDefault()
                    e.stopPropagation()
                    methods.add()
                } else if (getKey(e) === KEY.down) {
                    e.preventDefault()
                    e.stopPropagation()
                    methods.minus()
                }
            },
        }

        return () => (
            <pl-input class={classes.value}
                      isFocus={state.isFocus}
                      inputInnerTabindex={null}
                      {...{props: props.inputProps}}
            >
                {!props.hideButton && (
                    <div class="pl-number-prepend-button plain-click-node" onMousedown={handler.intervalMinus} {...{directives: [{name: 'click-wave'}]}}>
                        <pl-icon icon="el-icon-minus"/>
                    </div>
                )}
                <input type="text"
                       value={model.value}
                       disabled={editComputed.value.disabled}
                       readonly={editComputed.value.readonly}
                       onFocus={handler.focus}
                       onBlur={handler.blur}
                       onInput={handler.input}
                       onKeydown={handler.keydown}/>
                {!props.hideButton && (
                    <div class="pl-number-append-button plain-click-node" onMousedown={handler.intervalAdd} {...{directives: [{name: 'click-wave'}]}}>
                        <pl-icon icon="el-icon-plus"/>
                    </div>
                )}
            </pl-input>
        )
    },
})