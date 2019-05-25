<template>
    <div class="demo-base-table-column-prop">
        <im-demo-row>
            <im-toggle v-model="isShow"/>
        </im-demo-row>
        <im-demo-row title="基本用法" v-show="isShow">
            <im-base-table :data="data" id="trainno">
                <im-tc-column title="类型" field="type" fixed="left"/>
                <im-tc-column title="车次" field="trainno"/>
                <im-tc-column title="用时" field="costtime"/>
                <im-tc-column title="出发站" field="station"/>
                <im-tc-column title="到达站" field="endstation" fixed="right"/>
            </im-base-table>
        </im-demo-row>
    </div>
</template>

<script>
    import {SimpleTableData} from "../../data";

    export default {
        name: "demo-base-table-column-prop",
        data() {
            return {
                isShow: true,
                data: SimpleTableData,
            }
        },

    }
</script>

<style lang="scss">

</style>