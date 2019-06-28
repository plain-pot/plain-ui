<template>
    <pl-input v-model="filterData.value" @enter="pl_enter" @clear="pl_clear"/>
</template>

<script>
    export default {
        name: "plain-table-filter-input",
        props: {
            filterData: {},
        },
        methods: {
            pl_enter() {
                this.$emit('confirm')
            },
            pl_clear() {
                this.filterData.value = null
                this.$emit('clear')
            },
        }
    }
</script>

<style lang="scss">

</style>