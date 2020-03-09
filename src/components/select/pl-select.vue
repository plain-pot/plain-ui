<template>
    <pl-input
            ref="input"
            class="pl-select-input"
            :class="{'pl-multi-select-input':!!multiple}"
            suffixIcon="el-icon-arrow-down"
            clearIcon
            :value="multiple?multipleInputValue: ((isShow&&filterable)?p_inputValue:inputValue)"
            :placeholder="p_placeholder"
            :isFocus="isOpen"
            :clearHandler="onClickClearIcon"
            :inputReadonly="!filterable"

            @input="onInput"
            @click-input="onClickInput"
            @click-suffix-icon="onClickSuffixIcon"
            @keydown.space="onSpace"
            @keydown.enter="onEnter"
            @keydown.up="onUp"
            @keydown.down="onDown"
            @keydown.esc="onEsc"
            @blur="onBlur"
            @focus="onFocus"
    >
        <span v-if="multiple" class="pl-multi-select-input-wrapper">
            <span class="pl-multi-select-input-item pl-multi-select-input-take-over">&nbsp;</span>
            <span class="pl-multi-select-input-item" v-for="(item,index) in multipleData" :key="index">
                <span>{{item.label}}</span>
                <pl-icon icon="el-icon-circle-close" @click.native.stop.prevent="onClickItemCloseIcon(item,index)"/>
            </span>
        </span>
    </pl-input>
</template>

<script>


    import {EditMixin, EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-select",
        mixins: [EmitMixin, EditMixin],
        provide() {
            return {
                rParentEditor: this,
            }
        },
        props: {
            placeholder: {type: String},                                //空值占位符

            value: {},                                                  //双向绑定值
            multiple: {type: Boolean},                                  //是否为多选

            data: {type: Array},                                        //下拉数据
            labelKey: {type: String},                                   //文本的key
            valueKey: {type: String},                                   //值的key

            multipleLimit: {type: Number, default: 0},                  //多选限制可以选择的项目数
            filterable: {type: Boolean, default: true},                 //是否可以输入筛选，输入的时候如果没有展开，则会自动展开，但是这个在ie下无效，原因比较复杂。简单说明的话，是因为ie下，input在 pl-select下会派发莫名其妙的 input 事件。
            filterMethod: {type: Function},                             //输入筛选自定义函数
            noMatchText: {type: String, default: '无匹配数据'},          //没有匹配的时候的显示的文本
            noDataText: {type: String, default: '无数据'},               //没有数据的时候显示的文本
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        emitters: {
            emitInput: '派发input事件',
            emitSpace: 'input派发space按键事件',
            emitBlur: '派发失去焦点事件',
            emitFocus: '派发获取焦点事件',
        },
        data() {
            return {
                p_value: this.value,                                    //props中value的缓存值
                p_placeholder: this.placeholder,                        //props中的placeholder的缓存值
                p_inputValue: null,                                     //input输入框的输入文本值
                p_blurTimer: 0,                                         //失去焦点计数器，用来防止点击select item的时候派发blur事件
                p_focusTimer: 0,                                        //获取焦点计数器，用来防止点击select item的时候重新使input获取焦点，派发无效的focus事件

                p_select: null,                                         //下拉select对象
                p_selectOption: {                                       //下拉select的option参数
                    data: () => this.p_selectData,
                    value: () => this.p_value,
                    reference: () => this.$refs.input,
                    noDataText: () => this.p_noDataText,
                    render: this.$scopedSlots.default,
                    labelKey: 'label',
                    valueKey: 'value',
                    keyboard: false,
                    autoClose: false,
                    beforeHide: () => {
                        if (!this.multiple) {
                            this.p_placeholder = this.placeholder || ''
                            this.p_inputValue = null
                        }
                    },
                    beforeShow: () => {
                        if (!this.multiple) {
                            this.p_placeholder = this.inputValue
                        }
                    },
                    onMousedownPopper: () => {
                        if (this.p_blurTimer === 0) {
                            this.p_blurTimer++
                        }
                        if (this.p_focusTimer === 0) {
                            this.p_focusTimer++
                        }
                    },
                    onClick: (item) => {
                        let value;
                        if (!this.multiple) {
                            value = item.value
                        } else {
                            value = this.p_value || []
                            let index = value.indexOf(item.value)
                            if (index > -1) {
                                value.splice(index, 1)
                            } else {
                                if (!!this.multipleLimit && value.length >= this.multipleLimit) {
                                    return this.$plain.$message.warn(`最多只能选择 ${this.multipleLimit} 个选项！`)
                                } else {
                                    value.push(item.value)
                                }
                            }
                            value = [...value]
                        }

                        this.p_value = value
                        this.$refs.input.focus()
                        this.emitInput(this.p_value)

                        if (!this.multiple) {
                            this.hide()
                        }
                    }
                },
            }
        },
        created() {
            /*防止用户关闭select之后，仍然在input输入框中输入无效文本，失去焦点之后，设置为有效文本*/
            this.$on('blur', () => {
                this.$refs.input.p_value = !!this.multiple ? this.multipleInputValue : this.inputValue
            })
        },
        mounted() {
            this.p_selectOption.render = !this.$scopedSlots.default ? null : (h, item, index) => {
                return this.$scopedSlots.default({
                    ...item,
                    data: item.data.data,
                    index,
                })
            }
        },
        computed: {
            /**
             * 所有数据，解析label以及value
             * @author  韦胜健
             * @date    2020/1/28 10:54
             */
            p_data() {
                if (!this.data || this.data.length === 0) return null
                return this.data.map(d => {
                    let label = !!this.labelKey ? d[this.labelKey] : d;
                    let value = !!this.valueKey ? d[this.valueKey] : d
                    return {label, value, data: d}
                })
            },
            /**
             * 下拉的数据，通过输入的文本进行筛选
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            p_selectData() {
                let data = this.p_data
                if (!data || data.length === 0) return null
                if (!this.p_inputValue) return data
                return data.filter((item, index) => {
                    if (!!this.filterMethod) {
                        return this.filterMethod(this.p_inputValue, item, index)
                    } else {
                        const label = item.label
                        return label.toLowerCase().indexOf(this.p_inputValue.toLowerCase()) > -1
                    }
                })
            },
            p_noDataText() {
                if (!this.p_data) return this.noDataText
                if (!this.p_selectData || this.p_selectData.length === 0) return this.noMatchText
            },
            /**
             * 单选时，显示的文本
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            inputValue() {
                let data = this.p_data
                if (!data || data.length === 0) {
                    return ''
                }
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (this.p_value == item.value) return item.label
                }
                return ''
            },
            /**
             * 多选时，显示的数组数据
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            multipleData() {
                if (!this.p_value) return null
                if (this.$plain.utils.typeOf(this.p_value) !== 'array') {
                    console.error('The value of multiple select should be array')
                    return
                }
                if (!this.p_data || this.p_data.length === 0) return
                return this.p_data.filter(d => this.p_value.indexOf(d.value) > -1)
            },
            /**
             * 多选时，传递给input的显示值
             * @author  韦胜健
             * @date    2020/1/28 11:03
             */
            multipleInputValue() {
                if (!this.multipleData) return ''
                return this.multipleData.map(item => item.label).join('')
            },
            /**
             * 当前是否显示
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            isShow() {
                if (!this.p_select) return false
                return this.p_select.isShow()
            },
            /**
             * 当前是否已经关闭
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            isOpen() {
                if (!this.p_select) return false
                return this.p_select.isOpen()
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /**
             * 打开下拉框
             * @author  韦胜健
             * @date    2020/1/28 10:55
             */
            async show() {
                if (!this.isEditable) return
                await this.checkSelect()
                this.p_select.show()
            },
            /**
             * 关闭下拉框
             * @author  韦胜健
             * @date    2020/1/28 10:56
             */
            async hide() {
                await this.checkSelect()
                this.p_select.hide()
            },
            /**
             * 打开|关闭 下拉框
             * @author  韦胜健
             * @date    2020/1/28 10:56
             */
            async toggle() {
                await this.checkSelect()
                if (this.isShow) {
                    this.hide()
                } else {
                    this.show()
                }
            },


            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 检查p_select是否已经初始化实例，没有则初始化
             * @author  韦胜健
             * @date    2020/1/28 10:56
             */
            async checkSelect() {
                if (!this.p_select) this.p_select = await this.$plain.$select.newSelect(this.p_selectOption)
            },

            /*---------------------------------------event handler-------------------------------------------*/
            /**
             * 点击清楚图标动作
             * @author  韦胜健
             * @date    2020/1/28 10:56
             */
            onClickClearIcon() {
                this.p_value = null
                this.emitInput(this.p_value)
            },
            /**
             * 点击后置图标动作
             * @author  韦胜健
             * @date    2020/1/28 10:56
             */
            async onClickSuffixIcon() {
                await this.show()
            },
            /**
             * 输入框输入文本事件，文本值用来筛选下拉数据
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            async onInput(val) {
                this.p_inputValue = val
                if (!this.isShow && !this.$plain.utils.ie) {
                    this.show()
                }
            },
            /**
             * 点击输入框动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            async onClickInput() {
                await this.toggle()
            },
            /**
             * 输入框获取焦点时，space按键动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            onSpace(e) {
                if (this.multiple && this.isShow) {
                    e.stopPropagation()
                    e.preventDefault()
                    this.p_select.selectCurrentItem()
                }
                this.emitSpace(e)
            },
            /**
             * 输入框获取焦点时，enter按键动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            async onEnter(e) {
                e.stopPropagation()
                e.preventDefault()
                if (this.isShow) {
                    this.p_select.selectCurrentItem()
                } else {
                    await this.show()
                }
            },
            /**
             * 输入框获取焦点时，up按键动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            onUp(e) {
                e.stopPropagation()
                e.preventDefault()
                if (!!this.p_select) {
                    this.p_select.prev()
                }
            },
            /**
             * 输入框获取焦点时，down按键动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            onDown(e) {
                e.stopPropagation()
                e.preventDefault()
                if (!!this.p_select) {
                    this.p_select.next()
                }
            },
            /**
             * 输入框获取焦点时，esc按键动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            onEsc(e) {
                e.stopPropagation()
                e.preventDefault()
                if (this.isShow) {
                    this.hide()
                }
            },
            /**
             * 输入框获取焦点时，失去焦点动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            async onBlur(...args) {
                if (this.p_blurTimer > 0) {
                    this.p_blurTimer--
                } else {
                    this.emitBlur(...args)
                    if (!!this.isShow) {
                        this.hide()
                    }
                }
            },
            /**
             * 输入框获取焦点时，获取焦点动作
             * @author  韦胜健
             * @date    2020/1/28 10:57
             */
            onFocus(...args) {
                if (this.p_focusTimer > 0) {
                    this.p_focusTimer--
                } else {
                    this.emitFocus(...args)
                }
            },
            /**
             * 点击已选选项的删除图标动作
             * @author  韦胜健
             * @date    2020/1/29 8:53
             */
            onClickItemCloseIcon(item, index) {
                index = this.p_value.indexOf(item.value)
                if (index > -1) {
                    this.p_value.splice(index, 1)
                    this.p_value = [...this.p_value]
                }
                this.emitInput(this.p_value)
            },
        },
    }
</script>

<style lang="scss">
</style>