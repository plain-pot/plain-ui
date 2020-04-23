<template>
    <div class="plt-body-item">
        <table cellpadding="0" cellspacing="0" border="0">
            <tr v-for="rowData in plTable.tableData" :key="rowData.rowIndex" class="plt-row">
                <plt-body-cell v-for="(plc,plcIndex) in pltBody.bodyPlcList" :key="plcIndex" :plc="plc" :rowData="rowData"/>
            </tr>
        </table>
    </div>
</template>

<script>
    import {TableComponentMixin} from "./table-utils";

    export default {
        name: "plt-body-item",
        mixins: [
            TableComponentMixin
        ],
        inject: {
            pltBody: {default: null}
        },

    }
</script>

<style lang="scss">

</style>