export default {
    name: 'select',
    data() {
        return {
            edit(h, {row, editRow, col, colIndex, require, prop}) {
                return (<pl-select {...{props: {...prop, value: editRow[col.field]}, on: {input: (val) => this.$set(editRow, col.field, val),}}}/>)
            },
        }
    },
}