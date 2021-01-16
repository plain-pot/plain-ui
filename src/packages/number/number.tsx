import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {ClickWave} from "../click-wave/click-wave-directive";
import {useModel} from "../../use/useModel";
import {reactive, computed} from 'vue';
import {useProps} from "../../use/useProps";
import {HTMLInputEvent} from "../../shims";
import {getKey, KEY} from "../keyboard";
import './number.scss'

const NAN = 'NAN'

export const PlNumber = designComponent({
    name: 'pl-number',
    directives: {
        ClickWave,
    },
    props: {
        ...StyleProps,
        ...EditProps,

        modelValue: {type: [String, Number]},                       // 双向绑定值
        min: {type: [String, Number]},                              // 最小值
        max: {type: [String, Number]},                              // 最大值
        step: {type: [String, Number], default: 1},                 // 计数器步长
        stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
        precision: {type: [Number, String]},                        // 数值精度
        hideButton: {type: Boolean},                                // 隐藏操作按钮

        /*---------------------------------------input-------------------------------------------*/
        inputProps: {type: Object},                                 // pl-input属性配置对象
    },
    emits: {
        onFocus: (e: Event) => true,
        onBlur: (e: Event) => true,
        onUpdateModelValue: (val: string | number | undefined) => true,
        onEnter: (e: KeyboardEvent) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoEmit: false})
        useStyle({status: undefined})
        const {editComputed} = useEdit()
        const state = reactive({
            isFocus: false,                                         // 当前是否获取焦点
            interval: null as null | number,                        // 进步器长摁定时器
        })

        const {propsState} = useProps(props, {
            min: useProps.NUMBER,
            max: useProps.NUMBER,
            step: useProps.NUMBER,
            precision: useProps.NUMBER,
        }) as {
            propsState: {
                min: number | null,
                max: number | null,
                step: number,
                precision: number | null,
            }
        }

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            getValue: (val: any): undefined | number | 'NAN' => {
                if (val == null) return undefined
                val = String(val).trim()
                if (val === '') return undefined
                val = Number(val)
                if (isNaN(val)) {
                    return NAN
                } else {
                    return val
                }
            },
            getEffectiveValue: (): number | undefined => {
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
            },
            checkValue: (value: number | undefined): number | undefined => {
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
                    if (props.stepStrictly && value! % propsState.step! !== 0) {
                        // console.log('props.value', props.modelValue)
                        value = props.modelValue == undefined ? undefined : Number(props.modelValue)
                    }
                    // precision
                    if (propsState.precision != null) {
                        value = Number(value!.toFixed(propsState.precision))
                    }
                }
                return value
            }
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
        const formatValue = computed(() => utils.getValue(props.modelValue))

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
                emit.onUpdateModelValue(model.value)
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
                emit.onUpdateModelValue(model.value)
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
            focus: (e: Event) => {
                state.isFocus = true
                emit.onFocus(e)
            },
            blur: (e: Event) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                state.isFocus = false
                emit.onBlur(e)
            },
            input: (e: HTMLInputEvent) => {
                model.value = e.target.value
            },
            enter: (e: KeyboardEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                emit.onEnter(e)
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
                model.value = undefined
                emit.onUpdateModelValue(model.value)
            },
            keydown: (e: KeyboardEvent) => {
                const key = getKey(e)
                switch (key) {
                    case KEY.up:
                        e.preventDefault()
                        e.stopPropagation()
                        methods.add()
                        break
                    case KEY.down:
                        e.preventDefault()
                        e.stopPropagation()
                        methods.minus()
                        break
                    case KEY.enter:
                        handler.enter(e)
                        break
                }
            },
        }

        return {
            refer: {
                ...methods,
            },
            render: () => (
                <pl-input class={classes.value}
                          isFocus={state.isFocus}
                          inputInnerTabindex={null}
                          {...(props.inputProps || {})}
                >
                    {!props.hideButton && (
                        <div class="pl-number-prepend-button plain-click-node" onMousedown={handler.intervalMinus} v-click-wave>
                            <pl-icon icon="el-icon-minus"/>
                        </div>
                    )}
                    <input type="text"
                           value={model.value}
                           disabled={editComputed.value.disabled!}
                           readonly={editComputed.value.readonly!}
                           onFocus={handler.focus}
                           onBlur={handler.blur}
                           onInput={handler.input as any}
                           onKeydown={handler.keydown}/>
                    {!props.hideButton && (
                        <div class="pl-number-append-button plain-click-node" onMousedown={handler.intervalAdd} v-click-wave>
                            <pl-icon icon="el-icon-plus"/>
                        </div>
                    )}
                </pl-input>
            )
        }
    },
})