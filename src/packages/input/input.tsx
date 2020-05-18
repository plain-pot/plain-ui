import {computed, defineComponent, reactive, watch} from '@vue/composition-api'
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useListener} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";
import {useRefer} from "@/use/useRefer";

import {HTMLInputEvent, StyleType} from "@/types/utils";
import {PlainUtils} from "@/util/util";
import {getKey, KEY} from "@/packages/keyboard";
import {CompRef, ElRef, useRefs} from "@/use/useRefs";

export default defineComponent({
    name: 'pl-input',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: String},
        placeValue: {type: String},

        width: {type: [Number, String], default: null,},        // 输入框默认宽度
        minHeight: {type: [Number, String], default: 100},      // 文本域最小高度
        maxHeight: {type: [Number, String], default: 156},      // 文本域最大高度
        block: {type: Boolean},                                 // 块级元素
        textarea: {type: Boolean},                              // 当前是否为文本域输入框
        suffixIcon: {type: [String, Function]},                 // 右侧图标
        prefixIcon: {type: String},                             // 左侧图标
        clearIcon: {type: Boolean},                             // 清除图标
        clearHandler: {type: Function},                         // 点击清除图标处理逻辑

        autoHeight: {type: Boolean},                            // 自适应高度
        isFocus: {type: Boolean},                               // 当前是否处于激活状态
        inputReadonly: {type: Boolean},                         // 输入框只读
        throttleEnter: {type: [Boolean, Number]},               // enter按键事件节流
        autoLoading: {type: Boolean},                           // enter自动处理异步任务，开启/关闭loading状态

        /*---------------------------------------原生属性-------------------------------------------*/
        inputInnerTabindex: {type: Number, default: 0},
        type: {type: String, default: 'text'},
        placeholder: {type: String},
        nativeProps: {type: Object, default: () => ({})},
    },
    setup(props, context) {

        /*---------------------------------------ref-------------------------------------------*/

        const refs = useRefs({
            input: CompRef,
            hiddenInput: ElRef,
        })

        /*---------------------------------------emitter-------------------------------------------*/

        const {emit} = useListener(context, {
            input: EmitFunc,
            focus: EmitFunc,
            blur: EmitFunc,
            keydown: EmitFunc,
            enter: EmitFunc,

            clickInput: EmitFunc,
            clickPrefixIcon: EmitFunc,
            clickSuffixIcon: EmitFunc,
            clickClearIcon: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const propsState = useProps(props, {
            width: [FormatPropsType.number, FormatPropsType.function, FormatPropsType.promise],
            minHeight: [FormatPropsType.number, FormatPropsType.function, FormatPropsType.promise],
            maxHeight: [FormatPropsType.number, FormatPropsType.function, FormatPropsType.promise],
        })

        const styleState = useStyle(props, {status: undefined})
        const {editState, editComputed} = useEdit(props)

        const state = reactive({
            autoHeight: null as null | number,
            handlerEnter: null as null | Function,
            handleEnterInner: async (e) => {
                if (editComputed.value.editable) {
                    if (props.autoLoading) {
                        editState.loading = true
                        try {
                            if (!!context.listeners.enter) {
                                await context.listeners.enter(e)
                            }
                        } catch (e) {
                        } finally {
                            editState.loading = null
                        }
                    } else {
                        emit.enter(e)
                    }
                }
            },
        })

        const model = useModel(() => props.value, emit.input)

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            // 发现一个非常奇怪的现象，div.pl-input-inner 里面的input、派发的input事件，居然也能够在 div.pl-input-inner这个div节点上监听到。神奇
            // ie 下不知道为什么页面初始化的之后这里默认就执行了一次，这里判断绕过这个问题
            input: (e: HTMLInputEvent) => {
                if (e.target !== document.activeElement) {
                    return
                }
                model.value = e.target.value
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

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => ([
            `pl-input-shape-${styleState.value.shape}`,
            `pl-input-size-${styleState.value.size}`,
            {
                [`pl-input-status-${styleState.value.status}`]: !!styleState.value.status,
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
        ]))

        const styles = computed(() => {
            const styles: StyleType = {}
            /*没有前置以及后置插槽以及非块级元素的情况下，设置宽度*/
            if (propsState.width !== null && !props.block) {
                styles.width = PlainUtils.suffixPx(propsState.width)
            }
            /*textarea自动高度的时候，取最大高度最小高度以及滚动高度*/
            if (!!props.textarea) {
                if (!props.autoHeight || state.autoHeight == null) {
                    styles.height = PlainUtils.suffixPx(state.autoHeight)
                } else {
                    if (propsState.maxHeight != null && state.autoHeight > propsState.maxHeight) {
                        styles.height = PlainUtils.suffixPx(propsState.maxHeight)
                    } else if (state.autoHeight < propsState.minHeight) {
                        styles.height = PlainUtils.suffixPx(propsState.minHeight)
                    } else {
                        styles.height = PlainUtils.suffixPx(state.autoHeight)
                    }
                }
            }
            return styles
        })

        const publicProps = computed(() => ({
            style: styles.value,
            attrs: {
                disabled: editComputed.value.disabled,
                readonly: props.inputReadonly || editComputed.value.readonly || editComputed.value.loading,
            },
            domProps: {
                value: model.value,
                placeholder: props.placeholder,
                ...(props.nativeProps || {}),
            },
            on: {
                click: emit.clickInput,
                focus: emit.focus,
                blur: emit.blur,
                keydown: (e) => {
                    emit.keydown(e)
                    if (getKey(e) === KEY.enter) {
                        handler.enter(e)
                    }
                },
            },
            ref: "input",
        }))


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
            resetTextAreaHeight: PlainUtils.throttle(() => {
                if (!!props.autoHeight && !!props.textarea) {
                    setTimeout(() => state.autoHeight = refs.hiddenInput!.scrollHeight + 12, 0)
                }
            }, 300),
        }

        /*---------------------------------------watcher-------------------------------------------*/

        watch(() => model.value, () => {
            methods.resetTextAreaHeight()
        }, {lazy: true})
        watch(() => props.throttleEnter, (val) => {
            if (!val) {
                state.handlerEnter = state.handleEnterInner
            }
            if (val === true) {
                val = 1000
            }
            state.handlerEnter = PlainUtils.throttle(state.handleEnterInner, val, {trailing: true})
        })

        useRefer({
            methods,
            model,
            propsState,
            styleState,
            editState,
            editComputed,
            state,
        })

        /*---------------------------------------render-------------------------------------------*/

        return () => {

            const ppp = publicProps.value

            // 突然发现，在composition-api的情况下，slots不是响应式属性，这里为了解决这个办法，先暂时在render函数中实时计算这个input属性
            if (!context.slots.default) {
                (ppp.on as any).input = handler.input
            }

            if (props.textarea) {
                /*渲染文本域*/
                return (
                    <div class={['pl-textarea', classes.value]}>
                        <textarea class="pl-textarea-inner" {...ppp}></textarea>
                        <textarea class="pl-textarea-inner pl-textarea-hidden" ref="hiddenInput" value={model.value}></textarea>
                    </div>
                )
            } else {
                /*普通输入框*/
                const input = (
                    <div class={['pl-input', classes.value]}>
                        {!!props.prefixIcon && <span class="pl-input-prefix-icon" onClick={handler.clickPrefixIcon}><pl-icon icon={props.prefixIcon}/></span>}
                        {!!context.slots.default ?
                            <div tabIndex={props.inputInnerTabindex} class="pl-input-inner" {...ppp}>
                                {context.slots.default()}
                            </div>
                            :
                            <input class="pl-input-inner" {...ppp}/>}

                        {!!props.suffixIcon && <span class="pl-input-suffix-icon">
                            {typeof props.suffixIcon === 'function' ? props.suffixIcon() : <pl-icon nativeOn={{mousedown: handler.clickSuffixIcon}} icon={props.suffixIcon}/>}
                        </span>}
                        {!!props.clearIcon && (<span class="pl-input-suffix-icon pl-input-clear-icon"><pl-icon nativeOn={{mousedown: handler.clickClearIcon}} icon="el-icon-error"/></span>)}
                        {!!editComputed.value.loading && <pl-loading class="pl-input-suffix-icon"/>}
                    </div>
                )

                if (!context.slots.prepend && !context.slots.append) {
                    return input
                } else {
                    /*输入框组*/
                    return (
                        <div class="pl-input-group">
                            {!!context.slots.prepend && <div class="pl-input-prepend">{context.slots.prepend()}</div>}
                            {input}
                            {!!context.slots.append && <div class="pl-input-append">{context.slots.append()}</div>}
                        </div>
                    )
                }
            }
        }
    },
})