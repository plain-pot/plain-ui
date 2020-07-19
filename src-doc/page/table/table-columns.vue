<template>
    <div class="table-columns">
        <pl-table :data="data">
            <plc field="id" title="普通文本列"/>
            <plc-input field="name" title="文本框"/>
            <plc-number field="size" title="数字框"/>
            <plc field="date" title="日期"/>
            <plc field="color" title="颜色"/>

            <plc field="star" title="评分"/>
        </pl-table>
    </div>
</template>

<script>
    import data from "../data/data-1.json";


    export default {
        name: "table-columns",
        data() {
            return {
                data,
            }
        },
    }
</script>

<style lang="scss">

</style>