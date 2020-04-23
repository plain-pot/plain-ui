<template>
    <div class="plt-head-item" :class="classes">
        <table cellspacing="0" cellpadding="0" border="0" :style="tableStyles">
            <tr v-for="(row,rowIndex) in pltHead.headPlcList" :key="rowIndex">
                <plt-head-cell v-for="(cell,cellIndex) in row" :key="cellIndex" :plc="cell"/>
            </tr>
        </table>
    </div>
</template>

<script>
    import {TableComponentMixin} from "./table-utils";

    export default {
        name: "plt-head-item",
        inject: {
            pltHead: {default: null}
        },
        mixins: [
            TableComponentMixin
        ],
        props: {
            part: {type: String, default: 'center'},
        },
        computed: {
            classes() {
                return [
                    `pl-head-item-part-${this.part}`
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