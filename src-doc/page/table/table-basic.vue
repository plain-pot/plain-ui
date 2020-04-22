<template>
    <div class="demo-table-basic">
        <demo-row title="基础用法">
            <pl-table :data="tableData">
                <plc field="id" title="编号"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="size" title="大小"/>
                <plc field="star" title="评分"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from '../data/data-1'

    export default {
        name: "table-basic",
        data() {
            // const {color, date, id, name, size, star} = {}
            return {
                tableData: data,
            }
        },
    }
</script>

<style lang="scss">

</style>