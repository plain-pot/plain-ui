<template>
    <div class="pl-base-table-head-item" :class="[`pl-base-table-head-item-${fixed}`]" :style="{width:`${width}px`}">
        <table cellspacing="0" cellpadding="0" border="0">
            <tr v-for="(row,rowIndex) in headColumns" :key="rowIndex">
                <pl-base-table-head-cell v-for="(col,colIndex) in row"
                                         :fixed="fixed"
                                         :key="col.id"
                                         :col="col"
                                         :col-index="colIndex"
                                         :sort-field="sortField"
                                         :sort-desc="sortDesc"
                                         :head-row-height="headRowHeight"/>
            </tr>
            <template v-if="!!fixedRowData && fixedRowData.length>0">
                <pl-base-table-row
                        class="pl-base-table-row-fixed"
                        v-for="(item,index) in fixedRowData"
                        :key="item.id"
                        :body-row-height="bodyRowHeight"
                        :body-columns="bodyColumns"
                        :fixed="fixed"
                        :row-data="item"
                        :index="index"/>
            </template>
        </table>
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import PlBaseTableHeadCell from "./pl-base-table-head-cell";
    import PlBaseTableRow from "./pl-base-table-row";

    export default {
        name: "pl-base-table-head-item",
        components: {PlBaseTableRow, PlBaseTableHeadCell},
        mixins: [TableMixin],
        computed: {
            /*
             *  设置表格外层显示的宽度，比如左固定列表格的宽度就是左固定列宽度纸盒
             *  @author     martsforever
             *  @datetime   2019/1/6 21:51
             */
            width() {
                return this.bodyColumns.reduce((ret, item) => (item.fixed === this.fixed || this.fixed === 'center') ? ret + item.width : ret, 0)
            },
        },
    }
</script>

<style lang="scss">
    .pl-base-table-head-item {
        background-color: #f9f9f9;
        overflow: hidden;

        &.pl-base-table-head-item-left, &.pl-base-table-head-item-right {
            position: absolute;
            top: 0;
        }

        &.pl-base-table-head-item-right {
            right: 0;

            & > table {
                float: right;
            }
        }

        .pl-base-table-row-fixed {
            background-color: #e6e6e6;
        }
    }
</style>