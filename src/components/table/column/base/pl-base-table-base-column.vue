<template>
    <pl-base-table-column
            ref="column"
            v-bind="columnBinding"

            :scopedSlots="$scopedSlots || {}"
            :renderNormal="normal"
            :renderEdit="edit || normal"
            :renderHead="head"
            :external-prop="externalProp"
            :get-fields="getFields"
    />
</template>

<script>
    import PlBaseTableColumn from "../../pl-base-table-column";
    import {PublicColumnMixin} from "../../index";

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
                externalProp: {},
                getFields: () => {
                    return [this.field]
                }
            }
        },
        methods: {
            /*@formatter:off*/
            col() {return this.$refs.column.col()},
            /*@formatter:on*/
        },
        computed: {
            publicProps() {
                return {
                    required: this.required,
                    rules: this.rules,
                    validFunc: this.validFunc,
                    validOnInit: this.validOnInit,
                    requiredFunc: this.requiredFunc,
                }
            },
        },
    }
</script>

<style lang="scss">

</style>
