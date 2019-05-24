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
        mixins: [PublicColumnMixin],
        data() {
            return {
                /*@formatter:off*/
                /*normal(h, {row, editRow, showRow,text, rowIndex, col, colIndex, prop}) {return <span>{text}</span>},
                edit(h, {row, editRow, showRow, text,rowIndex, col, colIndex, prop}) {return <span>{text}</span>},
                head(h, {col}) {return <span>{col.title}</span>},*/

                normal:null,
                edit:null,
                head:null,
                /*@formatter:on*/

            }
        },
        methods: {
            /*@formatter:off*/
            col() {return this.$refs.column.col()},
           /*@formatter:on*/
        }
    }
</script>

<style lang="scss">

</style>