<template>
    <tr class="pl-base-table-row" :class="classes">
        <td v-for="(col,colIndex) in bodyColumns" :key="rowData.index+'-'+col.id">
            <pl-base-table-cell
                    :is-fixed="fixed === col.fixed"
                    :height="bodyRowHeight"
                    :width="col.width"
                    :col="col"
                    :col-index="colIndex"

                    :data="rowData"
                    :index="index"
                    :default-scoped-slots="col.scopedSlots.default"
                    :default-render-func="col.renderNormal"
                    :edit-scoped-slots="col.scopedSlots.edit"
                    :edit-render-func="col.renderEdit"
            />
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
            index: {},
        },
        computed: {
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