<template>
    <div class="table-tree-data">
        <pl-table :data="data"
                  keyField="id"
                  childrenField="subs"
        >
            <plc-tree/>
            <plc title="编号" field="id"/>
            <plc title="名称" field="name"/>
        </pl-table>
    </div>
</template>

<script>

    import data from '../data/tree.data'

    export default {
        name: "table-tree-data",
        data() {
            return {
                data,
            }
        },
    }
</script>

<style lang="scss">

</style>