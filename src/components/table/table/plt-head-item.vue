<template>
    <div class="plt-head-item">
        <table cellspacing="0" cellpadding="0" border="0">
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
        mounted() {
        }
    }
</script>

<style lang="scss">

</style>