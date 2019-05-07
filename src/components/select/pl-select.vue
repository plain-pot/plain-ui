<template>
    <div>
        <pl-input class="pl-select" @click="pl_click" :value="p_showValue" ref="input"/>
        [{{p_value}}]
    </div>
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
        },
        data() {
            return {
                p_select: null,
                p_showValue: null,
            }
        },
        methods: {
            async pl_click() {
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
                    this.p_showValue = this.pl_getShowValue(e)
                    this.p_value = this.pl_getValue(e)
                    this.$emit('input')
                })
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