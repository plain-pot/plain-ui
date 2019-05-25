export default {
    name: 'input',
    props: {
        input: {},
    },
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop}) {
                return (<pl-input {...{props: {...that.input, value: editRow[col.field]}, on: {input: (val) => this.$set(editRow, col.field, val),}}}/>)
            },
        }
    },
}