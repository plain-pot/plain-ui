<template>
    <div class="plt-body-item" :class="classes" :style="styles" @mouseenter="onMouseenter" v-on="on">
        <pl-virtual-table :width="width"
                          :data="plTable.tableData"
                          :summaryData="plTable.tableSummaryData"
                          :size="plTable.bodyRowHeight"
                          :disabled="plTable.isDisabledVirtualScroll"
                          :scrollProps="scrollProps"
                          @scroll="onScroll"
                          ref="virtualTable">
            <template slot-scope="{item,index}">
                <plt-row :key="index" :vid="index" :rowData="item"/>
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
        data() {
            const on: any = {}

            // 当鼠标
            if (this.fixed === PlcFixedType.center) {
                on.mousewheel = (e: any) => {
                    if (e.altKey) {
                        e.preventDefault()
                        e.stopPropagation()
                        this.virtualTable.scroll.scroll({x: this.virtualTable.scroll.p_wrapperScrollLeft + (e.deltaX || e.deltaY)})
                    }
                }
            }

            return {
                on,
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
            scrollProps() {
                return {
                    hideScrollbar: this.fixed === PlcFixedType.left,
                    scrollX: this.fixed === PlcFixedType.center,
                    scrollbarSize: 6,
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