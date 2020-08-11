<template>
    <div class="table-expand">
        <pl-table :data="data">
            <plc-check ref="check" toggleOnClickRow/>
<!--            <plc-expand toggleOnClickRow/>-->
            <plc field="name" title="普通文本列"/>
            <plc-input field="name" title="文本框" required/>
            <plc-number field="size" title="数字框"/>
            <plc-date field="date" title="日期" required/>
            <plc-color-picker field="color" title="颜色"/>
            <plc-rate field="star" title="评分"/>
            <plc-toggle field="flag" title="开关"/>
        </pl-table>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-expand",
        data() {
            return {
                data,
            }
        },
    }
</script>

<style lang="scss">

</style>