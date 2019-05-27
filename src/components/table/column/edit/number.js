export default {
    name: 'number',
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                return (<pl-number {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        value: editRow[col.field],
                        required,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
        }
    },
}