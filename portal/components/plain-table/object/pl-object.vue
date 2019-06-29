<template>
    <pl-input
            ref="input"
            class="pl-object"
            :value="showValue"
            v-bind="inputBinding"
            icon="pad-search"
            @clear="pl_clear"
            @click="pl_click"
    />
</template>

<script>
    import {SimpleEditMixin} from "../../../../src/mixin/component-mixin";

    export default {
        name: "pl-object",
        mixins: [SimpleEditMixin],
        props: {
            option: {type: Object, required: true},
            map: {type: Object, required: true},
            row: {type: Object, required: true},
            showField: {type: String, required: true},
            before: {type: Function},
            after: {type: Function},
        },
        data() {
            return {}
        },
        computed: {
            showValue() {
                if (!this.row) return null
                return this.row[this.showField]
            },
            inputBinding() {
                return Object.assign({
                    inputReadonly: true,
                    placeholder: '请选择...',
                }, this.simpleBinding, this.input)
            },
        },
        methods: {
            async pl_click() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                if (!!this.before) await this.before()
                this.$object.pick(this.option, async (dataRow) => {
                    const row = dataRow.row
                    Object.keys(this.map).forEach(key => {
                        this.$set(this.row, key, row[this.map[key]])
                    })
                    !!this.after && await this.after(dataRow)
                })
            },
            pl_clear() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                Object.keys(this.map).forEach(key => this.$set(this.row, key, null))
            },
        },
    }
</script>

<style lang="scss">

</style>
