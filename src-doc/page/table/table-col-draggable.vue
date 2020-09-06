<template>
    <div class="table-col-draggable">
        <demo-row title="基本用法">
            <pl-table :data="data">
                <plc field="id" title="编号"/>
                <plc-group title="分组一">
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                </plc-group>
                <plc field="color" title="颜色"/>
                <plc-group title="分组二">
                    <plc field="name" title="名称"/>
                    <plc field="star" title="评分"/>
                </plc-group>
                <plc field="id" title="编号"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="star" title="评分"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-col-draggable",
        data() {
            return {
                data,
            }
        },
    }
</script>

<style lang="scss">

</style>