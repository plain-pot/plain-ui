<template>
    <pl-input v-model="filterData.value" @enter="pl_enter"/>
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
        }
    }
</script>

<style lang="scss">

</style>