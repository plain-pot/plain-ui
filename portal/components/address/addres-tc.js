export default {
    name: 'address',
    props: {
        province: {type: Boolean},
        city: {type: Boolean},
        area: {type: Boolean},
        parentField: {},

        formatter: {
            default() {
                return ({value, rowData}) => {
                    return this.$address.getNameByCode(value)
                }
            },
        },
        searchType: {default: 'address'},
    },
    data() {
        const that = this
        const {province, city, area, parentField} = this
        const externalProp = {province, city, area,}
        return {
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                if (!!parentField) externalProp.parentCode = editRow[parentField]
                return (<pl-address {...{
                    props: {
                        ...prop,
                        ...that.publicProps,
                        ...externalProp,
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
            externalProp,
        }
    },
}
