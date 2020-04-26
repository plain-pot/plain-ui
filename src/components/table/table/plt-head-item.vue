import {PlcFixedType} from "../plc/plc-utils";
<template>
    <div class="plt-head-item" :class="classes">
        <table cellspacing="0" cellpadding="0" border="0" :style="tableStyles">
            <tr v-for="(row,rowIndex) in pltHead.headPlcList" :key="rowIndex">
                <plt-head-cell v-for="(cell,cellIndex) in row" :key="cellIndex" :plc="cell"/>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {TableComponentMixin} from "./table-utils";
    import {Plc, PlcFixedType} from "../plc/plc-utils";

    export default {
        name: "plt-head-item",
        inject: {
            pltHead: {default: null}
        },
        mixins: [
            TableComponentMixin
        ],
        props: {
            fixed: {type: String, default: 'center'},
        },
        provide() {
            return {
                pltHeadItem: this,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-table-item-fixed-${this.fixed}`,
                ]
            },
            tableStyles() {
                if (!this.plTable.totalContentWidth) return
                const flatPlcList: Plc[] = this.plTable.bodyPlcList
                let totalWidth = 0
                flatPlcList.forEach(plc => {
                    if (plc.actualProps.fixed === this.fixed || this.fixed === PlcFixedType.center) {
                        totalWidth += plc.actualProps.width
                    }
                })
                return {
                    width: `${totalWidth}px`
                }
            },
        },
    }
</script>

<style lang="scss">

</style>