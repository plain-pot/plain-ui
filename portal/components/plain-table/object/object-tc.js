export default {
    name: 'object',
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                return (<pl-object {...{
                    props: {
                        ...prop,
                        ...that.publicProps,
                        value: editRow[col.field],
                        required,
                        before: (val) => that.pl_before({row, editRow, col, colIndex, require, prop, required}, val),
                        after: (val) => that.pl_after({row, editRow, col, colIndex, require, prop, required}, val),
                        row: editRow,
                        showField: col.field,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
        }
    },
    methods: {
        async pl_before(dataRow, val) {
            if (!!this.prop.before) await this.prop.before(dataRow, val)
        },
        async pl_after(dataRow, val) {
            if (!!this.prop.before) await this.prop.after(dataRow, val)
        },
    },
}
