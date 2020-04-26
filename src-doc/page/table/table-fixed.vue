<template>
    <div class="table-fixed">
        <demo-row title="固定列">
            <pl-table :data="tableData">
                <plc field="id" title="编号" fixed="left"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="star" title="评分" fixed="right"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from '../data/data-1'


    export default {
        name: "table-fixed",
        data() {
            return {
                tableData: data,
            }
        },
    }
</script>

<style lang="scss">

</style>