export default {
    name: 'toggle',
    props: {
        align: {default: 'center'},
        width: {default: 100},
        search: {default: false},
    },
    data() {
        const that = this

        const defaultProps = {
            size: 'small',
            trueValue: 'Y',
            falseValue: 'N',
        }

        return {
            normal(h, {row, editRow, showRow, col, colIndex, require, prop, required}) {
                prop = Object.assign({}, defaultProps, prop || {})
                return (<pl-toggle {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        value: showRow[col.field],
                        required,
                        disabled: true,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                prop = Object.assign({}, defaultProps, prop || {})
                return (<pl-toggle {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        value: editRow[col.field],
                        required,
                        disabled: false,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
        }
    },
}