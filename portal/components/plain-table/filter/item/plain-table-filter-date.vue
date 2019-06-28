<template>
    <pl-date range :start.sync="filterData.start" :end.sync="filterData.end" @change="$emit('confirm')" @clear="pl_clear"/>
</template>

<script>
    export default {
        name: "plain-table-filter-date",
        props: {
            filterData: {},
        },
        methods: {
            async pl_clear() {
                await this.$plain.nextTick()
                this.$emit('clear')
            },
        },
    }
</script>

<style lang="scss">

</style>