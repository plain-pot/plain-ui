<template>
    <div>
        <test-table :data="data"/>
    </div>
</template>

<script>

    import TestTable from './test-table/test-table'

    export default {
        name: "test",
        components: {
            TestTable,
        },
        data() {
            return {
                agent: null,
                data: [
                    {name: '山东省'},
                    {name: '山西省'},
                    {name: '湖南省'},
                    {name: '湖北省'},
                    {name: '四川省'},
                    {name: '广东省'},
                    {name: '广西省'},
                ],
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
</style>