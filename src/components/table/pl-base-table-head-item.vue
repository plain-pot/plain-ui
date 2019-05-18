<template>
    <div class="pl-base-table-head-item" :class="[`pl-base-table-head-item-${fixed}`]" :style="{width:`${width}px`}">
        <table cellspacing="0" cellpadding="0" border="0">
            <tr v-for="(row,rowIndex) in headColumns" :key="rowIndex">
                <pl-base-table-head-cell v-for="(col,colIndex) in row"
                                         :fixed="fixed"
                                         :key="colIndex"
                                         :col="col"
                                         :sort-field="sortField"
                                         :sort-desc="sortDesc"
                                         :head-row-height="headRowHeight"/>
            </tr>
        </table>
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import PlBaseTableHeadCell from "./pl-base-table-head-cell";

    export default {
        name: "pl-base-table-head-item",
        components: {PlBaseTableHeadCell},
        mixins: [TableMixin],
        computed: {
            /*
             *  设置表格外层显示的宽度，比如左固定列表格的宽度就是左固定列宽度纸盒
             *  @author     martsforever
             *  @datetime   2019/1/6 21:51
             */
            width() {
                if (this.fixed === 'center') return null
                return this.bodyColumns.reduce((ret, item) => item.fixed === this.fixed ? ret + item.width : ret, 0)
            },
        },
    }
</script>