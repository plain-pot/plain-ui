<template>
    <pl-base-table-column
            ref="column"
            v-bind="columnBinding"

            :scopedSlots="$scopedSlots || {}"
            :renderNormal="normal"
            :renderEdit="edit"
            :renderHead="head"
            :propData="propData || {}"
    />
</template>

<script>
    import PlBaseTableColumn from "../pl-base-table-column";
    import {PublicColumnMixin} from "../index";
    export default {
        name: "pl-base-table-base-column",
        components: {PlBaseTableColumn},
        mixins:[PublicColumnMixin],
        methods: {
            /*@formatter:off*/
            col() {return this.$refs.column.col()},
            normal(h, {row, editRow, showRow,text, rowIndex, col, colIndex, prop}) {return <span>{text}</span>},
            edit(h, {row, editRow, showRow, text,rowIndex, col, colIndex, prop}) {return <span>{text}</span>},
            head(h, {col}) {return <span>{col.title}</span>},
           /*@formatter:on*/
        }
    }
</script>

<style lang="scss">

</style>