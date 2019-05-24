<template>
    <div class="demo-base-table">
        <im-base-table :data="data" id="trainno">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="车次,fixed=left" field="trainno"/>
            <im-tc-column title="车次,fixed=right" field="trainno"/>
            <im-tc-column title="用时" field="costtime"/>
            <im-tc-column title="出发站" field="station"/>
            <im-tc-column title="到达站" field="endstation"/>
            <im-tc-column title="出发时间" field="departuretime"/>
            <im-tc-column title="到达时间" field="arrivaltime"/>
            <im-tc-column title="顺序" field="sequenceno"/>
            <im-tc-column title="用时" field="costtime"/>
            <im-tc-column title="距离" field="distance"/>
            <im-tc-column title="是否终点" field="isend"/>
            <im-tc-column title="商务座票价" field="pricesw"/>
            <im-tc-column title="特等座票价" field="pricetd"/>
            <im-tc-column title="高级软卧上票价" field="pricegr1"/>
            <im-tc-column title="高级软卧下票价" field="pricegr2"/>
        </im-base-table>
    </div>
</template>

<script>

    import {TableData} from "../../data";

    export default {
        name: "demo-base-table",
        data() {
            return {
                data: TableData,
            }
        },
    }
</script>

<style lang="scss">
    .demo-base-table {
        box-sizing: border-box;
        padding: 16px;
    }
</style>