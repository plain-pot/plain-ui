<template>
    <div class="plt-body-item" :class="classes">
        <pl-virtual-table :width="plTable.totalContentWidth" :data="plTable.tableData" :summaryData="plTable.tableSummaryData" :size="plTable.bodyRowHeight" ref="virtualTable">
            <template slot-scope="{item,index}">
                <pl-item tag="tr" :key="index" class="plt-row">
                    <plt-body-cell v-for="(plc,plcIndex) in plTable.bodyPlcList" :key="plcIndex" :plc="plc" :rowData="item"/>
                </pl-item>
            </template>
        </pl-virtual-table>
    </div>
</template>

<script>
    import {TableComponentMixin} from "./table-utils";
    import {RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "plt-body-item",
        mixins: [
            TableComponentMixin,
            RefsMixinFactory({
                virtualTable: Object,
            })
        ],
        inject: {
            pltBody: {default: null}
        },
        props: {
            part: {type: String, default: 'center'},
        },
        created() {
            this.pltBody.bodyItems[this.part] = this
        },
        beforeDestroy() {
            this.pltBody.bodyItems[this.part] = null
        },
        computed: {
            classes() {
                return [
                    `pl-body-item-part-${this.part}`
                ]
            },
        },

    }
</script>

<style lang="scss">

</style>