<script>

    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-input",
        mixins: [
            EditMixin,
            EmitMixin,
            StyleMixin,
            PropsMixinFactory.create({
                width: PropsMixinFactory.ALL,
                minHeight: PropsMixinFactory.Number,
                maxHeight: PropsMixinFactory.Number,
            }),
        ],
        props: {
            value: {type: String},

            width: {type: [Number, String], default: null,},    // 输入框默认宽度
            minHeight: {type: [Number, String], default: 100},   // 文本域最小高度
            maxHeight: {type: [Number, String], default: 156},  // 文本域最大高度
            block: {type: Boolean},                             // 块级元素
            textarea: {type: Boolean},                          // 当前是否为文本域输入框
            suffixIcon: {type: String},                         // 右侧图标
            prefixIcon: {type: String},                         // 左侧图标
            clearIcon: {type: Boolean},                         // 清除图标
            clearHandler: {                                     // 点击清除图标处理逻辑
                type: Function, default: function (e) {
                    this.clearValue(e)
                }
            },
            autoHeight: {type: Boolean},                        // 自适应高度
            isFocus: {type: Boolean},                           // 当前是否处于激活状态
            inputReadonly: {type: Boolean},                     // 输入框只读
            throttleEnter: {type: [Boolean, Number]},           // enter按键事件节流
            autoLoading: {type: Boolean},                       // enter自动处理异步任务，开启/关闭loading状态

            /*---------------------------------------原生属性-------------------------------------------*/
            inputInnerTabindex: {type: Number, default: 0},
            type: {type: String, default: 'text'},
            placeholder: {type: String},
            nativeProps: {type: Object, default: () => ({})},
        },
        emitters: {
            emitInput: '输入文本事件',
            emitFocus: '获取焦点事件',
            emitBlur: '失去焦点事件',
            emitKeydown: '按键事件',
            emitClickInput: '点击input输入框事件',
            emitClickPrefixIcon: '点击前置图标事件',
            emitClickSuffixIcon: '点击后置图标事件',
            emitClickClearIcon: '点击清除图标事件',
        },
        watch: {
            value(val) {
                this.p_value = val
            },
            throttleEnter: {
                immediate: true,
                handler(val) {
                    if (!val) {
                        return this.handleEnter = this.handlerEnterInner
                    }
                    if (val === true) {
                        val = 1000
                    }
                    this.handleEnter = this.$plain.utils.throttle(this.handlerEnterInner, val, {trailing: false})
                },
            },
        },
        data() {
            return {
                p_value: this.value,
                p_autoHeight: null,                         // 自动高度的大小
                handleEnter: null,
                handlerEnterInner: async (e) => {
                    if (this.isEditable) {
                        if (this.autoLoading) {
                            this.p_loading = true
                            try {
                                await this.$listeners.enter(e)
                            } catch (e) {
                            } finally {
                                this.p_loading = null
                            }
                        } else {
                            this.$emit('enter', e)
                        }
                    }
                },

                /*---------------------------------------handler-------------------------------------------*/
                /*输入框输入事件*/
                onInput: (e) => {
                    this.p_value = e.target.value
                    this.emitInput(this.p_value)
                },
                /*点击前置图标*/
                onClickPrefixIcon: e => {
                    if (!this.isEditable) return
                    e.stopPropagation()
                    e.preventDefault()
                    this.emitClickPrefixIcon(e)
                },
                /*点击后置图标*/
                onClickSuffixIcon: e => {
                    if (!this.isEditable) return
                    e.stopPropagation()
                    e.preventDefault()
                    this.emitClickSuffixIcon(e)
                },
                /*点击清除图标*/
                onClickClearIcon: e => {
                    if (!this.isEditable) return
                    e.stopPropagation()
                    e.preventDefault()
                    this.emitClickClearIcon(e)
                    this.clearHandler(e)
                },
                /*重置文本域高度*/
                resetTextAreaHeight: this.$plain.utils.throttle(() => {
                    if (!!this.autoHeight && !!this.textarea) {
                        this.$nextTick(() => this.p_autoHeight = this.$refs.hiddenInput.scrollHeight + 12)
                    }
                }, 300),
            }
        },
        created() {
            /*文本域自动高度的时候，监听p_value，变化nextTick之后重新计算文本域高度*/
            if (!!this.autoHeight && this.textarea) {
                this.$watch('p_value', () => this.resetTextAreaHeight())
            }
        },
        computed: {
            classes() {
                return [
                    `pl-input-shape-${this.p_shape || 'fillet'}`,
                    `pl-input-size-${this.p_size || 'normal'}`,
                    {
                        [`pl-input-status-${this.p_status}`]: !!this.p_status,
                        'pl-input-block': this.block,
                        'pl-input-disabled': !!this.isDisabled,
                        'pl-input-prefix-padding': !!this.prefixIcon,
                        'pl-input-suffix-padding': !!this.suffixIcon || !!this.clearIcon || this.isLoading,
                        'pl-input-prefix': !!this.prefixIcon,
                        'pl-input-suffix': !!this.suffixIcon || this.isLoading,
                        'pl-input-clear': !!this.clearIcon,
                        'pl-input-empty': !this.p_value,
                        'pl-input-focus': this.isFocus,
                        'pl-input-not-editable': !this.isEditable,
                    }
                ]
            },
            styles() {
                const styles = {}
                /*没有前置以及后置插槽以及非块级元素的情况下，设置宽度*/
                if (this.p_width !== null && !this.block) {
                    styles.width = this.$plain.utils.suffixPx(this.p_width)
                }
                /*textarea自动高度的时候，取最大高度最小高度以及滚动高度*/
                if (!!this.textarea) {
                    if (!this.autoHeight || this.p_autoHeight == null) {
                        styles.height = this.$plain.utils.suffixPx(this.p_minHeight)
                    } else {
                        if (this.p_maxHeight != null && this.p_autoHeight > this.p_maxHeight) {
                            styles.height = this.$plain.utils.suffixPx(this.p_maxHeight)
                        } else if (this.p_autoHeight < this.p_minHeight) {
                            styles.height = this.$plain.utils.suffixPx(this.p_minHeight)
                        } else {
                            styles.height = this.$plain.utils.suffixPx(this.p_autoHeight)
                        }
                    }
                }
                return styles
            },
            /*textarea与input共同所需要的属性*/
            publicProps() {
                return {
                    style: this.styles,
                    attrs: {
                        disabled: this.isDisabled,
                        readonly: this.inputReadonly || this.isReadonly || this.isLoading,
                    },
                    domProps: {
                        value: this.p_value,
                        placeholder: this.placeholder,
                        ...this.nativeProps,
                    },
                    on: {
                        input: e => {
                            /*ie 下不知道为什么页面初始化的之后这里默认就执行了一次，这里判断绕过这个问题*/
                            if (e.target === document.activeElement) {
                                this.onInput(e)
                            }
                        },
                        click: this.emitClickInput,
                        focus: this.emitFocus,
                        blur: this.emitBlur,
                        keydown: (e) => {
                            this.emitKeydown(e)
                            if (e.keyCode === 13) {
                                this.handleEnter(e)
                            }
                        },
                    },
                    ref: 'input',
                }
            },
        },
        render() {
            if (this.textarea) {
                /*渲染文本域*/
                return (
                    <div class={['pl-textarea', this.classes]}>
                        <textarea class="pl-textarea-inner" {...this.publicProps}>
                        </textarea>
                        <textarea class="pl-textarea-inner pl-textarea-hidden" ref="hiddenInput" value={this.p_value}></textarea>
                    </div>
                )
            } else {
                /*普通输入框*/
                const input = (
                    <div class={['pl-input', this.classes]}>
                        {!!this.prefixIcon && <span class="pl-input-prefix-icon" onClick={this.onClickPrefixIcon}><pl-icon icon={this.prefixIcon}/></span>}
                        {!!this.$slots.default ?
                            <div tabIndex={this.inputInnerTabindex} class="pl-input-inner" {...this.publicProps}>
                                {this.$slots.default}
                            </div>
                            :
                            <input class="pl-input-inner" {...this.publicProps}/>}

                        {!!this.suffixIcon && <span class="pl-input-suffix-icon"><pl-icon nativeOn={{click: this.onClickSuffixIcon}} icon={this.suffixIcon}/></span>}
                        {!!this.clearIcon && (<span class="pl-input-suffix-icon pl-input-clear-icon"><pl-icon nativeOn={{click: this.onClickClearIcon}} icon="el-icon-circle-close"/></span>)}
                        {!!this.isLoading && <pl-loading class="pl-input-suffix-icon"/>}
                    </div>
                )

                if (!this.$slots.prepend && !this.$slots.append) {
                    return input
                } else {
                    /*输入框组*/
                    return (
                        <div class="pl-input-group">
                            {!!this.$slots.prepend && <div class="pl-input-prepend">{this.$slots.prepend}</div>}
                            {input}
                            {!!this.$slots.append && <div class="pl-input-append">{this.$slots.append}</div>}
                        </div>
                    )
                }
            }
        },
        methods: {
            /**
             * 清除值
             * @author  韦胜健
             * @date    2020-01-25 11:43
             */
            clearValue() {
                this.onInput({target: {value: null}})
            },
            /**
             * 获取焦点
             * @author  韦胜健
             * @date    2020-01-25 11:43
             */
            focus() {
                if (!!this.$refs.input && !!this.$refs.input.focus) this.$refs.input.focus()
            },
            /**
             * 取消焦点
             * @author  韦胜健
             * @date    2020-01-25 11:43
             */
            blur() {
                if (!!this.$refs.input && !!this.$refs.input.blur) this.$refs.input.blur()
            },
        },
    }
</script>

<style lang="scss">
</style>