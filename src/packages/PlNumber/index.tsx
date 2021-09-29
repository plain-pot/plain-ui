import {computed, designComponent, reactive, useModel, useNumber, useRefs, useClasses} from "plain-ui-composition";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {getKey, KEY} from "../keyboard";
import {PlInput} from "../PlInput";
import PlIcon from "../PlIcon";
import {useClickWave} from "../../directives/ClickWave";
import './number.scss'

const NAN = 'NAN'

export const PlNumber = designComponent({
    name: 'pl-number',
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
    inheritPropsType: PlInput,
    emits: {
        onFocus: (e: FocusEvent) => true,
        onBlur: (e: FocusEvent) => true,
        onUpdateModelValue: (val: string | number | undefined) => true,
        onEnter: (e: KeyboardEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            add: HTMLDivElement,
            sub: HTMLDivElement,
            input: PlInput,
            innerInput: HTMLInputElement,
        })

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoEmit: false})
        useStyle({status: undefined})
        const {editComputed} = useEdit()
        const state = reactive({
            isFocus: false,                                         // 当前是否获取焦点
            interval: null as null | number,                        // 进步器长摁定时器
            timer: null as null | number,
        })

        const {numberState} = useNumber(props, ['step', 'max', 'min', 'precision'])

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
                        if (numberState.min != null) return numberState.min
                        else if (numberState.max != null) return numberState.max
                        else if (props.stepStrictly) return numberState.step
                        else return 0
                    }
                }
                return value
            },
            checkValue: (value: number | undefined): number | undefined => {
                if (value != null) {
                    // min
                    if (numberState.min != null && value < numberState.min) {
                        value = numberState.min
                    }
                    // max
                    if (numberState.max != null && value! > numberState.max) {
                        value = numberState.max
                    }
                    // stepStrictly
                    if (props.stepStrictly && value! % numberState.step! !== 0) {
                        // console.log('props.value', props.modelValue)
                        value = props.modelValue == undefined ? undefined : Number(props.modelValue)
                    }
                    // precision
                    if (numberState.precision != null) {
                        value = Number(value!.toFixed(numberState.precision))
                    }
                }
                return value
            }
        }

        /*---------------------------------------computer-------------------------------------------*/

        const classes = useClasses(() => ([
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
                value += numberState.step
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
                value -= numberState.step
                value = utils.checkValue(value)
                model.value = value
                emit.onUpdateModelValue(model.value)
            },
            clearInterval: () => {              // 清除定时器
                if (state.interval != null) {
                    clearInterval(state.interval)
                }
                if (state.timer != null) {
                    clearTimeout(state.timer)
                }
                window.removeEventListener('mouseup', methods.clearInterval)
            },
            focus: () => {
                refs.input!.methods.focus()
            },
            blur: () => {
                refs.input!.methods.blur()
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            focus: (e: FocusEvent) => {
                state.isFocus = true
                emit.onFocus(e)
            },
            blur: (e: FocusEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                state.isFocus = false
                emit.onBlur(e)
            },
            input: (e: any) => {
                model.value = e.target.value
            },
            enter: (e: KeyboardEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                emit.onEnter(e)
            },
            intervalAdd: () => {
                methods.add()
                state.timer = setTimeout(() => {
                    state.interval = setInterval(methods.add, 100) as any as number
                }, 500) as any as number
                window.addEventListener('mouseup', methods.clearInterval)
            },
            intervalMinus: () => {
                methods.minus()
                state.timer = setTimeout(() => {
                    state.interval = setInterval(() => methods.minus(), 100) as any as number
                }, 500) as any as number
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

        useClickWave({elGetter: () => refs.add, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable})})
        useClickWave({elGetter: () => refs.sub, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable})})

        return {
            refer: {
                ...methods,
            },
            render: () => (
                <PlInput
                    ref={onRef.input}
                    class={classes.value}
                    isFocus={state.isFocus}
                    inputInnerTabindex={null as any}
                    {...(props.inputProps || {})}
                >
                    {!props.hideButton && (
                        <div class="pl-number-prepend-button plain-click-node" onMousedown={handler.intervalMinus} ref={onRef.sub}>
                            <PlIcon icon="el-icon-minus"/>
                        </div>
                    )}
                    <input
                        ref={onRef.innerInput}
                        type="text"
                        value={model.value == null ? '' : model.value}
                        disabled={editComputed.value.disabled!}
                        readonly={editComputed.value.readonly!}
                        placeholder={editComputed.value.placeholder!}
                        onFocus={handler.focus}
                        onBlur={handler.blur}
                        onInput={handler.input}
                        onKeydown={handler.keydown}/>
                    {!props.hideButton && (
                        <div class="pl-number-append-button plain-click-node" onMousedown={handler.intervalAdd} ref={onRef.add}>
                            <PlIcon icon="el-icon-plus"/>
                        </div>
                    )}
                </PlInput>
            )
        }
    },
})

export default PlNumber
