<template>
    <div class="demo-base-table">
        <im-base-table :data="data" id="trainno" :fixedRowData="fixedRowData">
            <im-tc-column title="类型" field="type"/>
            <im-tc-column title="用时" field="costtime"/>
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
                fixedRowData: [
                    {type: '111', costtime: '222', trainno: 111},
                ]
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
