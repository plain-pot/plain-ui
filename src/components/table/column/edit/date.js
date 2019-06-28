import {DateUtil} from "../../../date";

export default {
    name: 'date',
    props: {
        formatter: {
            default() {
                return ({value, rowData}) => {
                    if (!value) return null
                    return this.$plain.$utils.dateFormat(this.$plain.$utils.dateParse(value, this.p_vf), this.p_df)
                }
            },
        },
        searchType: {default: 'date'},
    },
    data() {
        const that = this
        return {
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                return (<pl-date {...{
                    props: {
                        ...prop,
                        ...that.publicProps,
                        value: editRow[col.field],
                        required,
                    },
                    on: {input: (val) => this.$set(editRow, col.field, val),}
                }}/>)
            },
        }
    },
    computed: {
        p_df() {
            const prop = this.prop || {}
            return DateUtil.getDefaultDisplayFormat(prop.displayFormat, prop.datetime, prop.view)
        },
        p_vf() {
            const prop = this.prop || {}
            return DateUtil.getDefaultValueFormat(prop.valueFormat, prop.datetime, prop.view)
        },
    },
}