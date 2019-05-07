<template>
    <pl-input class="pl-select"
              :value="p_showValue"
              ref="input"
              inputReadonly
              :readonly="readonly"
              :disabled="disabled"
              :required="required"
              :open="pl_open"

              @clear="pl_clear"
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

            readonly: {type: Boolean},
            disabled: {type: Boolean},
            required: {type: Boolean},
        },
        watch: {
            value(val) {

            },
        },
        computed: {
            p_showValue() {
                const showValues = []
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    const value = this.pl_getValue(item)
                    if (value === this.p_value) {
                        showValues.push(this.pl_getShowValue(item))
                    }
                }
                return showValues.join(',')
            },
        },
        data() {
            return {
                p_select: null,
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
                    // slot: this.$scopedSlots.default,
                    render: this.pl_render,
                    onClose: () => this.p_select = null,
                }).then(e => {
                    this.p_value = this.pl_getValue(e)
                    this.$emit('input', this.p_value)
                })
            },
            pl_clear() {
                this.p_value = null
                this.$emit('input', this.p_value)
            },
            pl_render(h, {item}) {
                return (
                    <div class={this.pl_itemClass(item)}>
                        <pl-button type="none" noPadding>{this.pl_getShowValue(item)}</pl-button>
                    </div>
                )
            },
            pl_itemClass(item) {
                const val = this.pl_getValue(item)
                return [
                    'pl-select-item',
                    {
                        'pl-select-item-checked': val === this.p_value
                    }
                ]
            },
            pl_getValue(item) {
                return !!this.valueKey ? item[this.valueKey] : item
            },
            pl_getShowValue(item) {
                return !!this.labelKey ? item[this.labelKey] : item
            },
        }
    }
</script>

<style lang="scss">

</style>