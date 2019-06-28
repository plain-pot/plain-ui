<template>
    <pl-select :data="p_data" :labelKey="labelKey" :valueKey="valueKey" :value="filterData.value" @input="pl_input"/>
</template>

<script>
    export default {
        name: "plain-table-filter-select",
        props: {
            filterData: {},
            col: {},
        },
        computed: {
            p_data() {
                return !this.col || !this.col.prop || !this.col.prop.data ? [] : this.col.prop.data
            },
            labelKey() {
                return !this.col || !this.col.prop || !this.col.prop.data ? null : this.col.prop.labelKey
            },
            valueKey() {
                return !this.col || !this.col.prop || !this.col.prop.data ? null : this.col.prop.valueKey
            },
        },
        methods: {
            pl_input(val) {
                this.filterData.value = val
                this.$emit('confirm')
            },
        }
    }
</script>

<style lang="scss">

</style>