<template>
    <div class="plt-head-item">
        <table>
            <tr v-for="(row,rowIndex) in pltHead.headPlcList" :key="rowIndex">
                <td v-for="(cell,cellIndex) in row" :key="cellIndex" :colspan="cell.colspan" :rowspan="cell.rowspan">
                    {{cell.title}}
                </td>
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