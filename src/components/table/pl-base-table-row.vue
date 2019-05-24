<template>
    <tr class="pl-base-table-row" :class="classes">
        <td v-for="(col,colIndex) in bodyColumns" :key="colIndex">
            <pl-base-table-cell
                    :is-fixed="fixed === col.fixed"
                    :text="showRow[col.field]"
                    :height="bodyRowHeight"
                    :width="col.width"/>
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
            classes() {
                return [
                    {
                        'pl-base-table-row-check': this.rowData.check || this.rowData.hover
                    }
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-base-table-row {
            &.pl-base-table-row-check {
                background-color: plVar(colorPrimaryLighter);
            }
        }
    }
</style>