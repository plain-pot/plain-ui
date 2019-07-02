<template>
    <div class="demo-table-table-fixed">
        <im-base-table :data="simpleData" id="trainno" :fixedRowData="fixedRowData">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="车次,fixed=left" field="trainno" fixed="left"/>
            <im-tc-column title="车次,fixed=right" field="trainno" fixed="right"/>
            <im-tc-column title="用时" field="costtime" fixed="left"/>
            <im-tc-column title="出发站" field="station" fixed="right"/>
            <im-tc-column title="到达站" field="endstation"/>
            <im-tc-column title="出发时间" field="departuretime"/>
            <im-tc-column title="到达时间" field="arrivaltime"/>
            <im-tc-column title="顺序" field="sequenceno"/>
            <im-tc-column title="距离" field="distance"/>
            <im-tc-column title="是否终点" field="isend"/>
            <im-tc-column title="商务座票价" field="pricesw"/>
            <im-tc-column title="特等座票价" field="pricetd"/>
            <im-tc-column title="高级软卧上票价" field="pricegr1"/>
            <im-tc-column title="高级软卧下票价" field="pricegr2"/>
        </im-base-table>

        <im-base-table :data="simpleData" id="trainno">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="车次,fixed=left" field="trainno" fixed="left"/>
            <im-tc-column title="车次,fixed=right" field="trainno"/>
            <im-tc-column title="用时" field="costtime" fixed="left"/>
            <im-tc-column title="出发站" field="station"/>
            <im-tc-column title="到达站" field="endstation"/>
            <im-tc-column title="出发时间" field="departuretime"/>
            <im-tc-column title="到达时间" field="arrivaltime"/>
            <im-tc-column title="顺序" field="sequenceno"/>
            <im-tc-column title="距离" field="distance"/>
            <im-tc-column title="是否终点" field="isend"/>
            <im-tc-column title="商务座票价" field="pricesw"/>
            <im-tc-column title="特等座票价" field="pricetd"/>
            <im-tc-column title="高级软卧上票价" field="pricegr1"/>
            <im-tc-column title="高级软卧下票价" field="pricegr2"/>
        </im-base-table>
        <im-base-table :data="simpleData" id="trainno">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="车次,fixed=left" field="trainno" fixed="right"/>
            <im-tc-column title="车次,fixed=right" field="trainno"/>
            <im-tc-column title="用时" field="costtime" fixed="right"/>
            <im-tc-column title="出发站" field="station"/>
            <im-tc-column title="到达站" field="endstation"/>
            <im-tc-column title="出发时间" field="departuretime"/>
            <im-tc-column title="到达时间" field="arrivaltime"/>
            <im-tc-column title="顺序" field="sequenceno"/>
            <im-tc-column title="距离" field="distance"/>
            <im-tc-column title="是否终点" field="isend"/>
            <im-tc-column title="商务座票价" field="pricesw"/>
            <im-tc-column title="特等座票价" field="pricetd"/>
            <im-tc-column title="高级软卧上票价" field="pricegr1"/>
            <im-tc-column title="高级软卧下票价" field="pricegr2"/>
        </im-base-table>

        <im-base-table :data="data" id="trainno" :fixedRowData="fixedRowData">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="车次,fixed=left" field="trainno" fixed="left"/>
            <im-tc-column title="车次,fixed=right" field="trainno" fixed="right"/>

            <im-tc-group title="组1" fixed="left">
                <im-tc-column title="到达站" field="endstation"/>
                <im-tc-column title="出发时间" field="departuretime"/>
            </im-tc-group>

            <im-tc-group title="组2" fixed="right">
                <im-tc-column title="到达时间" field="arrivaltime"/>
                <im-tc-column title="顺序" field="sequenceno"/>
            </im-tc-group>


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

    import {TableData, SimpleTableData} from "../../data";

    export default {
        name: "demo-table-table-fixed",
        data() {
            return {
                simpleData: SimpleTableData,
                data: TableData,
                fixedRowData: [
                    {type: '111', costtime: '222', trainno: 111},
                ]
            }
        },
    }
</script>

<style lang="scss">
    .demo-table-table-fixed {
        box-sizing: border-box;
        padding: 16px;

        .pl-base-table {
            margin-bottom: 16px;
        }
    }
</style>