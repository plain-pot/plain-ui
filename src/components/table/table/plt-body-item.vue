import {TableHoverPart} from "./table-utils";
<template>
    <div class="plt-body-item" :class="classes" :style="styles" @mouseenter="onMouseenter">
        <pl-virtual-table :width="width"
                          :data="plTable.tableData"
                          :summaryData="plTable.tableSummaryData"
                          :size="plTable.bodyRowHeight"
                          :disabled="plTable.isDisabledVirtualScroll"
                          @scroll="onScroll"
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
    import {TableComponentMixin, TableHoverPart} from "./table-utils";
    import {EmitMixin, RefsMixinFactory} from "../../../utils/mixins";
    import {Plc, PlcFixedType} from "../plc/plc-utils";

    export default {
        name: "plt-body-item",
        mixins: [
            EmitMixin,
            TableComponentMixin,
            RefsMixinFactory({
                virtualTable: Object,
            })
        ],
        emitters: {
            emitScroll: Function
        },
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
        methods: {
            onScroll(e) {
                this.emitScroll(e, this.fixed)
            },
            onMouseenter() {
                this.plTable.onHoverPart(TableHoverPart.body, this.fixed)
            },
        },

    }
</script>

<style lang="scss">

</style>