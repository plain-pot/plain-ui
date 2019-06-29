export default {
    name: 'select',
    props: {
        formatter: {
            default() {
                return ({value, rowData}) => {
                    let prop = this.prop || {}
                    let data = prop.data || []
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i]
                        const itemVal = !!prop.valueKey ? item[prop.valueKey] : item
                        if (itemVal === value) {
                            return !!prop.labelKey ? item[prop.labelKey] : item
                        }
                    }
                }
            },
        },
        searchType: {default: 'select'},
    },
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                return (<pl-select {...{
                    props: {
                        ...prop,
                        ...that.publicProps,
                        value: editRow[col.field],
                        required,
                        before: (val) => that.pl_before({row, editRow, col, colIndex, require, prop, required}, val),
                        after: (val) => that.pl_after({row, editRow, col, colIndex, require, prop, required}, val),
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
