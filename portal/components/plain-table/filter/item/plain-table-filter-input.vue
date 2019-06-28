<template>
    <pl-input v-model="filterData.value" @enter="$emit('confirm')"/>
</template>

<script>
    export default {
        name: "plain-table-filter-input",
        props: {
            filterData: {},
        },

    }
</script>

<style lang="scss">

</style>