<template>
    <pl-select :data="p_data" labelKey="label" valueKey="code" :value="preValue" @input="pl_input"/>
</template>

<script>
    export default {
        name: "pl-ov",
        props: {
            type: {type: String},
            value: {},
        },
        watch: {
            type: {
                immediate: true,
                handler() {
                    this.pl_resetData()
                },
            },
            value: {
                immediate: true,
                handler(val) {
                    this.p_value = val
                }
            },
        },
        data() {
            return {
                p_value: null,
                p_data: [],
            }
        },
        methods: {
            pl_input(val) {
                this.p_value = val
                this.$emit('input', val)
            },
            async pl_resetData() {
                !!this.type && (this.p_data = await this.$ov.getByType(this.type))
            },
        },
        computed: {
            preValue() {
                if (!this.p_data || this.p_data.length === 0) return null
                return this.p_value
            },
        },
    }
</script>

<style lang="scss">

</style>
