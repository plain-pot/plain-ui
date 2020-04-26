<template>
    <div class="plt-body-item" :class="classes" :style="styles">
        <pl-virtual-table :width="width"
                          :data="plTable.tableData"
                          :summaryData="plTable.tableSummaryData"
                          :size="plTable.bodyRowHeight"
                          :disabled="plTable.isDisabledVirtualScroll"
                          ref="virtualTable">
            <template slot-scope="{item,index}">
                <pl-item tag="tr" :key="index" class="plt-row" :vid="index">
                    <plt-body-cell v-for="(plc,plcIndex) in plTable.bodyPlcList" :key="plcIndex" :plc="plc" :rowData="item"/>
                </pl-item>
            </template>
        </pl-virtual-table>
    </div>
</template>

<script lang="ts">
    import {TableComponentMixin} from "./table-utils";
    import {RefsMixinFactory} from "../../../utils/mixins";
    import {Plc, PlcFixedType} from "../plc/plc-utils";

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
            fixed: {type: String, default: 'center'},
        },
        provide() {
            return {
                pltBodyItem: this,
            }
        },
        created() {
            this.pltBody.bodyItems[this.fixed] = this
        },
        beforeDestroy() {
            this.pltBody.bodyItems[this.fixed] = null
        },
        computed: {
            classes() {
                return [
                    `pl-table-item-fixed-${this.fixed}`
                ]
            },
            width() {
                if (!this.plTable.totalContentWidth) return
                const flatPlcList: Plc[] = this.plTable.bodyPlcList
                let totalWidth = 0
                flatPlcList.forEach(plc => {
                    if (plc.actualProps.fixed === this.fixed || this.fixed === PlcFixedType.center) {
                        totalWidth += plc.actualProps.width
                    }
                })
                return totalWidth
            },
            styles() {
                if (this.fixed === PlcFixedType.center) {
                    return null
                } else {
                    return {
                        width: `${this.width}px`
                    }
                }
            },
        },

    }
</script>

<style lang="scss">

</style>