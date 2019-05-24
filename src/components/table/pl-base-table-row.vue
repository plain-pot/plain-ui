<template>
    <tr class="pl-base-table-row">
        <td v-for="(col,colIndex) in bodyColumns" :key="colIndex">
            <pl-base-table-cell
                    :is-fixed="fixed === col.fixed"
                    :data="{row,editRow,rowIndex,col,colIndex,showRow,prop:col.propData}"
                    :text="showRow[col.field]"
                    :height="bodyRowHeight"
                    :width="col.width"
                    :col="col"

                    :default-scoped-slots="col.scopedSlots.default"
                    :default-render-func="col.renderNormal"
                    :edit-scoped-slots="col.scopedSlots.edit"
                    :edit-render-func="col.renderEdit"
                    :editing="p_editing"/>
        </td>
    </tr>
</template>

<script>
    import PlBaseTableCell from "./pl-base-table-cell";
    import {TableMixin} from "./index";

    export default {
        name: "pl-base-table-row",
        components: {PlBaseTableCell},
        mixins: [TableMixin],
        props: {
            rowData: {},
        },
        computed: {
            showRow() {
                return this.rowData.editable ? this.rowData.editRow : this.rowData.row
            },
        },
    }
</script>

<style lang="scss">

</style>