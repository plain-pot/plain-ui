<template>
    <div class="plt-head-item">
        <table>
            <tr v-for="(row,rowIndex) in plTable.headPlcList" :key="rowIndex">
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
        mixins: [
            TableComponentMixin
        ],
        mounted() {
            this.$nextTick(() => {
                console.log(this.plTable.headPlcList)
            })
        }
    }
</script>

<style lang="scss">

</style>