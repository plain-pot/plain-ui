
export default {
    name: 'input',
    computed: {
        prop() {
            return this.inputBinding
        },
    },
    methods: {
        edit(h, {row, editRow, col, colIndex, require, prop}) {
            return (<link-input {...{props: {...this.inputBinding, value: editRow[col.field]}, on: {input: (val) => this.$set(editRow, col.field, val),}}}/>)
        },
    },
}