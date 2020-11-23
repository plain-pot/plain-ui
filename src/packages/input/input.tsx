import {computed, onMounted, reactive, watch} from 'vue';
import './input.scss'
import {designComponent} from "../../use/designComponent";
import {useModel} from "../../use/useModel";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {useProps} from "../../use/useProps";
import {useClass} from "../../use/useClasses";
import {StyleProperties} from "../../shims";
import {unit} from 'plain-utils/string/unit';
import {getKey, KEY} from "../keyboard";
import {throttle} from 'plain-utils/utils/throttle';

console.log('load input component')

export default designComponent({
    name: 'pl-input',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: [String, Number]},
        placeValue: {type: String},

        width: {type: [Number, String, Object, Function], default: null,},        // 输入框默认宽度
        minHeight: {type: [Number, String], default: 100},      // 文本域最小高度
        maxHeight: {type: [Number, String], default: 156},      // 文本域最大高度
        block: {type: Boolean},                                 // 块级元素
        textarea: {type: Boolean},                              // 当前是否为文本域输入框
        suffixIcon: {type: [String, Function]},                 // 右侧图标
        prefixIcon: {type: String},                             // 左侧图标
        clearIcon: {type: Boolean},                             // 清除图标
        clearHandler: Function,                         // 点击清除图标处理逻辑

        autoHeight: {type: Boolean},                            // 自适应高度
        isFocus: {type: Boolean},                               // 当前是否处于激活状态
        inputReadonly: {type: Boolean},                         // 输入框只读
        throttleEnter: {type: [Boolean, Number]},               // enter按键事件节流
        autoLoading: {type: Boolean},                           // enter自动处理异步任务，开启/关闭loading状态
        asyncHandler: {type: Function},                         // 异步处理函数

        /*---------------------------------------原生属性-------------------------------------------*/
        inputInnerTabindex: {type: Number, default: 0},
        type: {type: String, default: 'text'},
        placeholder: {type: String},
        nativeAttrs: {type: Object, default: () => ({})},
    },
    emits: {
        updateModelValue: (val: any) => true,
        focus: (e: FocusEvent) => true,
        blur: (e: Event) => true,
        keydown: (e: KeyboardEvent) => true,
        enter: (e: Event) => true,

        clickInput: (e: MouseEvent) => true,
        clickPrefixIcon: (e: MouseEvent) => true,
        clickSuffixIcon: (e: MouseEvent) => true,
        clickClearIcon: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots([
            'prepend', 'append', 'hidden'
        ], true)
        const {refs} = useRefs({
            input: HTMLInputElement,
            hiddenInput: HTMLTextAreaElement,
        })
        const {propsState} = useProps(props, {
            width: [useProps.NUMBER, useProps.PROMISE, useProps.FUNCTION],
            minHeight: useProps.NUMBER,
            maxHeight: useProps.NUMBER,
        })
        const {styleComputed} = useStyle({status: undefined})
        const {editComputed, editState} = useEdit()
        const state = reactive({
            autoHeight: null as null | number,
            handlerEnter: null as null | Function,
            handleEnterInner: async (e: KeyboardEvent) => {
                if (editComputed.value.editable) {
                    if (props.autoLoading) {
                        if (!props.asyncHandler) {
                            return console.error(`pl-input: props.asyncHandler is necessary when autoLoading is true!`)
                        }
                        editState.loading = true
                        try {
                            await props.asyncHandler()
                        } catch (e) {
                            console.error(e)
                        } finally {
                            editState.loading = null
                        }
                    } else {
                        emit.enter(e)
                    }
                }
            },
        })
        const model = useModel(() => props.modelValue, emit.updateModelValue)

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            input: (e: Event) => {
                model.value = (e.target as HTMLInputElement).value
            },
            enter: (e: KeyboardEvent) => {
                state.handlerEnter!(e)
            },
            clickPrefixIcon: (e: MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.clickPrefixIcon(e)
            },
            clickSuffixIcon: (e: MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.clickSuffixIcon(e)
            },
            clickClearIcon: (e: MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.clickClearIcon(e)
                if (!!props.clearHandler) {
                    props.clearHandler(e)
                } else {
                    methods.clearValue()
                }
            }
        }

        /*---------------------------------------computed-------------------------------------------*/

        const classes = useClass(() => [
            `pl-input-shape-${styleComputed.value.shape}`,
            `pl-input-size-${styleComputed.value.size}`,
            {
                [`pl-input-status-${styleComputed.value.status}`]: !!styleComputed.value.status,
                'pl-input-block': props.block,
                'pl-input-disabled': !!editComputed.value.disabled,
                'pl-input-prefix-padding': !!props.prefixIcon,
                'pl-input-suffix-padding': !!props.suffixIcon || !!props.clearIcon || editComputed.value.loading,
                'pl-input-prefix': !!props.prefixIcon,
                'pl-input-suffix': !!props.suffixIcon || editComputed.value.loading,
                'pl-input-clear': !!props.clearIcon,
                'pl-input-empty': !model.value && !props.placeValue,
                'pl-input-focus': props.isFocus,
                'pl-input-not-editable': !editComputed.value.editable,
            }
        ])

        const styles = computed(() => {
            const styles: StyleProperties = {}
            /*没有前置以及后置插槽以及非块级元素的情况下，设置宽度*/
            if (propsState.width !== null && !props.block) {
                styles.width = unit(propsState.width)
            }
            /*textarea自动高度的时候，取最大高度最小高度以及滚动高度*/
            if (!!props.textarea) {
                if (!props.autoHeight || state.autoHeight == null) {
                    styles.height = unit(state.autoHeight)
                } else {
                    if (propsState.maxHeight != null && state.autoHeight > propsState.maxHeight) {
                        styles.height = unit(propsState.maxHeight)
                    } else if (state.autoHeight < propsState.minHeight) {
                        styles.height = unit(propsState.minHeight)
                    } else {
                        styles.height = unit(state.autoHeight)
                    }
                }
            }
            return styles
        })

        const publicProps = computed(() => ({
            style: styles.value,
            disabled: editComputed.value.disabled,
            readonly: props.inputReadonly || editComputed.value.readonly || editComputed.value.loading,
            value: model.value,
            placeholder: props.placeholder,
            ...(props.nativeAttrs || {}),

            // 发现一个非常奇怪的现象，div.pl-input-inner 里面的input、派发的input事件，居然也能够在 div.pl-input-inner这个div节点上监听到。神奇
            ...(!slots.default.isExist() ? {
                onInput: (e: Event) => {
                    /*ie 下不知道为什么页面初始化的之后这里默认就执行了一次，这里判断绕过这个问题*/
                    if (e.target === document.activeElement) {
                        handler.input(e)
                    }
                },
            } : {}),

            onClick: emit.clickInput,
            onFocus: emit.focus,
            onBlur: emit.blur,
            onKeydown: (e: KeyboardEvent) => {
                emit.keydown(e)
                if (getKey(e) === KEY.enter) {
                    handler.enter(e)
                }
            },
            ref: "input",
        } as any))

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            clearValue: () => {
                model.value = undefined
            },
            focus: () => {
                if (!!refs.input && !!refs.input.focus) {
                    refs.input.focus()
                }
            },
            blur: () => {
                if (!!refs.input && !!refs.input.blur) {
                    refs.input.blur()
                }
            },
            /*重置文本域高度*/
            resetTextAreaHeight: throttle(() => {
                if (!!props.autoHeight && !!props.textarea) {
                    setTimeout(() => state.autoHeight = refs.hiddenInput!.scrollHeight + 12, 0)
                }
            }, 300),
        }

        /*---------------------------------------watcher-------------------------------------------*/

        watch(() => model.value, () => {
            methods.resetTextAreaHeight()
        })
        watch(() => props.throttleEnter, (val) => {
            if (!val) {
                state.handlerEnter = state.handleEnterInner
            }
            if (val === true) {
                val = 1000
            }
            state.handlerEnter = throttle(state.handleEnterInner, val as number, {trailing: true})
        }, {immediate: true})

        onMounted(() => {
            if (props.textarea) {
                methods.resetTextAreaHeight()
            }
        })

        return {
            refer: {
                refs,
                state,
                propsState,
                methods,
                model,
            },
            render: () => {

                if (props.textarea) {
                    /*渲染文本域*/
                    return (
                        <div class={['pl-textarea', classes.value]}>
                            <textarea class="pl-textarea-inner" {...publicProps.value}/>
                            <textarea class="pl-textarea-inner pl-textarea-hidden" ref="hiddenInput" value={model.value}/>
                        </div>
                    )
                } else {
                    /*普通输入框*/
                    const input = (
                        <div class={['pl-input', classes.value]}>
                            {!!props.prefixIcon && <span class="pl-input-prefix-icon" onClick={handler.clickPrefixIcon}><pl-icon icon={props.prefixIcon}/></span>}

                            {slots.default.isExist() ?
                                <div tabIndex={props.inputInnerTabindex} class="pl-input-inner" {...publicProps.value}>
                                    {slots.default()}
                                </div>
                                :
                                <input class="pl-input-inner" {...publicProps.value}/>}

                            {!!props.suffixIcon && <span class="pl-input-suffix-icon">
                            {typeof props.suffixIcon === 'function' ? (props.suffixIcon as any)() : <pl-icon onMousedown={handler.clickSuffixIcon} icon={props.suffixIcon}/>}
                        </span>}
                            {!!props.clearIcon && (<span class="pl-input-suffix-icon pl-input-clear-icon"><pl-icon onMousedown={handler.clickClearIcon} icon="el-icon-error"/></span>)}
                            {!!editComputed.value.loading && <pl-loading class="pl-input-suffix-icon"/>}
                            {slots.hidden.isExist() && <div class="pl-input-inner-hidden">{slots.hidden()}</div>}
                        </div>
                    )

                    if (!slots.prepend.isExist() && !slots.append.isExist()) {
                        return input
                    } else {
                        /*输入框组*/
                        return (
                            <div class="pl-input-group">
                                {slots.prepend.isExist() && <div class="pl-input-prepend">{slots.prepend()}</div>}
                                {input}
                                {slots.append.isExist() && <div class="pl-input-append">{slots.append()}</div>}
                            </div>
                        )
                    }
                }
            }
        }
    },
})