export default {
    name: 'input',
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop}) {
                return (<pl-input {...{props: {...prop, ...(that.publicProps || {}), value: editRow[col.field]}, on: {input: (val) => this.$set(editRow, col.field, val),}}}/>)
            },
        }
    },
}