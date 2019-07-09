<template>
    <pl-input
            v-if="!multiple"
            ref="input"
            class="pl-select"
            :class="{'pl-select-open':p_show}"
            :value="p_inputValue === null?p_showValue:p_inputValue"
            :inputReadonly="disabledFilter"
            :readonly="readonly"
            :disabled="disabled"
            :required="required"
            :placeholder="placeholder"
            icon="pl-triangle-down-fill"
            v-bind="Object.assign({},input,simpleBinding)"

            @click="pl_open"
            @clear="pl_clear"
            @up.prevent="!!p_select && p_select.prev()"
            @down.prevent="!!p_select && p_select.next()"
            @enter="pl_enter"
            @tab="!!p_select && p_select.hide()"
            @esc="!!p_select && p_select.hide()"
            @space="pl_space"
            @input="pl_input"
            @blur="pl_blur"
    />
    <pl-tag-input
            v-else
            ref="input"
            class="pl-select"
            :class="{'pl-select-open':p_show}"
            :value="p_showValue"
            :readonly="readonly"
            :disabled="disabled"
            :required="required"
            :placeholder="placeholder"
            v-bind="input"
            icon="pl-triangle-down-fill"
            :onRemove="pl_onRemove"

            @click="pl_open"
            @clear="pl_clear"
            @keyup.up.prevent="!!p_select && p_select.prev()"
            @keydown.down.prevent="!!p_select && p_select.next()"
            @keyup.esc.prevent="!!p_select && p_select.hide()"
            @keydown.tab="!!p_select && p_select.hide()"
            @keyup.space.prevent="pl_space"

    />
</template>

<script>
    import PlInput from "../pl-input";
    import {SimpleEditMixin, ValueMixin} from "../../mixin/component-mixin";
    import PlButton from "../pl-button";
    import PlTagInput from "../tag/pl-tag-input";

    export default {
        name: "pl-select",
        components: {PlTagInput, PlButton, PlInput},
        mixins: [ValueMixin, SimpleEditMixin],
        props: {
            data: {type: Array, default: () => []},
            disabledFilter: {type: Boolean},
            dataFilter: {type: Function},
            labelKey: {type: String},
            valueKey: {type: String},
            multiple: {type: Boolean},
            input: {},
            popper: {},
            before: {type: Function},
            after: {type: Function},

            placeholder: {default: '请选择...'},
        },
        data() {
            return {
                p_value: [],
                p_select: null,
                p_show: false,
                p_watchValue: false,

                p_option: null,
                p_inputValue: null,
                p_showAllData: null,
            }
        },
        mounted() {
            this.p_option = {
                data: null,
                reference: this.$refs.input,
                autoFocus: false,
                labelKey: this.labelKey,
                render: this.pl_render,
                autoClose: !this.multiple,
                watchData: this.p_value,
                popper: {
                    ...(this.popper || {}),
                    onShow: () => this.p_show = true,
                    onHide: () => this.p_show = false,
                },
                onClose: () => {
                    this.p_select = null
                    this.p_inputValue = null
                },
                onOpen: () => this.pl_resetOptionData(),
                onConfirm: async (e) => {
                    const oldValue = this.p_value
                    const value = this.pl_getValue(e)
                    if (!this.multiple) {
                        this.p_value = value
                    } else {
                        const index = this.p_value.indexOf(value)
                        if (index > -1) {
                            this.p_value.splice(index, 1)
                        } else {
                            this.p_value.push(value)
                        }
                    }
                    this.$emit('input', this.p_value)
                    !!this.after && await this.after(this.p_value, oldValue)
                    this.p_inputValue = null
                },
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    if (this.p_value === val) return
                    if (!this.multiple) {
                        this.p_value = val
                    } else {
                        this.p_value = this.$plain.$utils.deepCopy(val || [])
                    }
                }
            },
            data(val) {
                !!this.p_select && (this.p_select.option.data = val)
            },
        },
        computed: {
            p_showValue() {
                if (!this.p_value) return null
                const showValues = []
                let showValue = null
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    const value = this.pl_getValue(item)
                    const itemShowValue = this.pl_getShowValue(item)
                    if (!this.multiple) {
                        if (value === this.p_value) {
                            showValue = itemShowValue
                            break
                        }
                    } else if (this.p_value.indexOf(value) > -1) {
                        showValues.push(itemShowValue)
                    }
                }
                if (!this.multiple && this.p_value != null && !showValue) showValue = this.p_value
                if (!this.multiple && this.p_value != null && showValues.length === 0) showValues.push(this.p_value)
                return !this.multiple ? showValue : showValues
            },
            optionData() {
                if (!this.data || this.data.length === 0) return null
                if (this.p_inputValue == null || !!this.p_showAllData) return this.data
                return this.data.filter(item => {
                    if (!!this.dataFilter) return this.dataFilter(this.data, this.p_value, this.p_showValue)
                    if (!!this.labelKey) return item[this.labelKey].indexOf(this.p_inputValue) > -1
                    else return item.indexOf(this.p_inputValue)
                })
            },
        },

        methods: {
            /*---------------------------------------处理事件-------------------------------------------*/
            async pl_open() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                if (!!this.before) await this.before(this.p_value)
                if (!this.p_select) this.p_select = await this.$plain.$select.getSelect()
                if (!this.p_select.p_show) {
                    this.p_showAllData = true
                    this.p_option.watchData = this.p_value
                    this.p_select.select(this.p_option)
                } else {
                    this.p_select.hide()
                }
            },
            pl_enter() {
                if (!!this.p_select) {
                    if (!this.multiple) {
                        this.p_select.confirm()
                    } else {
                        this.p_select.hide()
                    }
                } else {
                    this.pl_open()
                }
            },
            pl_input(val) {
                this.p_inputValue = val
                this.p_showAllData = false
                if (!this.p_select) {
                    this.pl_open()
                } else {
                    this.pl_resetOptionData()
                }
            },
            pl_blur() {
                this.p_inputValue = null
            },
            pl_space() {
                if (!!this.p_select) {
                    this.p_select.confirm()
                } else {
                    const {p_readonly, p_disabled} = this.$refs.input
                    if (!p_readonly && !p_disabled) this.pl_open()
                }
            },
            pl_onRemove(item, index) {
                this.p_value.splice(index, 1)
            },
            pl_clear() {
                this.p_value = !this.multiple ? null : []
                !!this.p_select && (this.p_select.watchData = this.p_value)
                this.$emit('input', this.p_value)
            },

            /*---------------------------------------其他函数-------------------------------------------*/
            pl_render(h, {item, index}) {
                const val = this.pl_getValue(item)
                const isChecked = !this.multiple ? val === this.p_value : this.p_value.indexOf(val) > -1
                const cls = [
                    'pl-select-item',
                    {
                        'pl-select-item-checked': isChecked,
                    }
                ]

                return (
                    <div class={cls}>
                        {!!this.multiple && <pl-icon icon={isChecked ? 'pad-check-square-fill' : 'pl-square-light'} class="pl-select-check-icon"/>}
                        <div class="pl-select-item-content">
                            {!!this.$scopedSlots.default ? <pl-scope-slot scope-slot-func={this.$scopedSlots.default} data={{item, index}}/> : this.pl_getShowValue(item)}
                        </div>
                    </div>
                )
            },
            pl_getValue(item) {
                return !!this.valueKey ? item[this.valueKey] : item
            },
            pl_getShowValue(item) {
                return !!this.labelKey ? item[this.labelKey] : item
            },
            pl_resetOptionData() {
                this.p_option.data = this.optionData
            },

        }
    }
</script>

<style lang="scss">

</style>
