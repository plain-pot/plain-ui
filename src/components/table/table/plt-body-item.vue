<template>
    <div class="plt-body-item" :class="classes">
        <pl-scroll scrollX ref="scroll">
            <table cellpadding="0" cellspacing="0" border="0" :style="tableStyles">
                <tr v-for="rowData in plTable.tableData" :key="rowData.rowIndex" class="plt-row">
                    <plt-body-cell v-for="(plc,plcIndex) in plTable.bodyPlcList" :key="plcIndex" :plc="plc" :rowData="rowData"/>
                </tr>
            </table>
        </pl-scroll>
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
        props: {
            part: {type: String, default: 'center'},
        },
        computed: {
            classes() {
                return [
                    `pl-body-item-part-${this.part}`
                ]
            },
            tableStyles() {
                if (!this.plTable.totalContentWidth) return
                return {
                    width: `${this.plTable.totalContentWidth}px`
                }
            },
        },

    }
</script>

<style lang="scss">

</style>