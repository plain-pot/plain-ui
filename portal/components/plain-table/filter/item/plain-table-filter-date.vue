<template>
    <pl-date range :start.sync="filterData.start" :end.sync="filterData.end" @change="$emit('confirm')"/>
</template>

<script>
    export default {
        name: "plain-table-filter-date",
        props: {
            filterData: {},
        },
    }
</script>

<style lang="scss">

</style>