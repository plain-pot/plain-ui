<template>
    <pl-ov v-bind="prop" :value="filterData.value" @input="pl_input"/>
</template>

<script>
    export default {
        name: "plain-table-filter-select",
        props: {
            filterData: {},
            col: {},
        },
        computed: {
            prop() {
                return {type: this.col.externalProp.type}
            },
        },
        methods: {
            pl_input(val) {
                this.filterData.value = val
                console.log(val)
                this.$emit('confirm')
            },
        }
    }
</script>

<style lang="scss">

</style>