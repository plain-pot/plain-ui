export default {
    name: 'radio',
    props: {
        align: {default: 'center'}
    },
    data() {
        const that = this
        return {
            normal(h, {row, editRow, col, colIndex, require, prop, required}) {
                prop = prop || {}
                prop.trueValue = prop.trueValue || 'Y'
                prop.falseValue = prop.falseValue || 'N'
                return (<pl-radio {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        value: row[col.field],
                        required,
                        disabled: true,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                prop = prop || {}
                prop.trueValue = prop.trueValue || 'Y'
                prop.falseValue = prop.falseValue || 'N'
                return (<pl-radio {...{
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