<template>
    <pl-input class="pl-select"
              :class="{'pl-select-open':isShow}"
              :value="p_showValue"
              ref="input"
              inputReadonly
              :readonly="readonly"
              :disabled="disabled"
              :required="required"
              :placeholder="placeholder"
              :open="pl_open"
              icon="pl-triangle-down-fill"

              @clear="pl_clear"
              @up="!!p_select && p_select.prev()"
              @down="!!p_select && p_select.next()"
              @enter="pl_enter"
              @tab="!!p_select && p_select.hide()"
              @esc="!!p_select && p_select.hide()"
              @space="pl_space"
    />
</template>

<script>
    import PlInput from "../pl-input";
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlButton from "../pl-button";

    export default {
        name: "pl-select",
        components: {PlButton, PlInput},
        mixins: [ValueMixin],
        props: {
            data: {type: Array, default: () => []},
            labelKey: {type: String},
            valueKey: {type: String},
            multiple: {type: Boolean},

            placeholder: {default: '请选择...'},
            readonly: {type: Boolean},
            disabled: {type: Boolean},
            required: {type: Boolean},
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    if (!this.multiple) {
                        this.p_value = val
                    } else {
                        this.p_value = this.$plain.$utils.deepCopy(val || [])
                    }
                }
            },
        },
        computed: {
            p_showValue() {
                const showValues = []
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    const value = this.pl_getValue(item)
                    const showValue = this.pl_getShowValue(item)
                    if (!this.multiple) {
                        if (value === this.p_value) {
                            return showValue
                        }
                    } else if (this.p_value.indexOf(value) > -1) {
                        showValues.push(showValue)
                    }
                }
                return showValues.join(',')
            },
        },
        data() {
            return {
                p_value: [],
                p_select: null,
                isShow: false,
                p_watchValue: false,
            }
        },
        methods: {
            async pl_open() {
                if (!this.p_select) this.p_select = await this.$plain.$select.getSelect()
                !this.p_select.isOpen && this.p_select.select({
                    reference: this.$refs.input,
                    autoFocus: false,
                    data: this.data,
                    labelKey: this.labelKey,
                    render: this.pl_render,
                    onClose: () => this.p_select = null,
                    autoClose: !this.multiple,
                    popper: {
                        onShow: () => this.isShow = true,
                        onHide: () => this.isShow = false,
                    },
                    onConfirm: (e) => {
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
                    },
                })
            },
            pl_clear() {
                this.p_value = !this.multiple ? null : []
                this.$emit('input', this.p_value)
            },
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
                        {!!this.multiple && <pl-icon icon={isChecked ? 'pad-check-square-fill' : 'pl-square-light'}/>}
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
            pl_enter() {
                if (!!this.p_select) {
                    if (!this.multiple) {
                        this.p_select.confirm()
                    } else {
                        this.p_select.hide()
                    }
                } else {
                    const {p_readonly, p_disabled} = this.$refs.input
                    if (!p_readonly && !p_disabled) this.pl_open()
                }
            },
            pl_space() {
                if (!!this.p_select) {
                    this.p_select.confirm()
                } else {
                    const {p_readonly, p_disabled} = this.$refs.input
                    if (!p_readonly && !p_disabled) this.pl_open()
                }
            },
        }
    }
</script>

<style lang="scss">

</style>