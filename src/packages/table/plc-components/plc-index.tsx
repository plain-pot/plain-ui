import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-index',
    props: {
        // custom
        summaryText: {type: String, default: '合计'},

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9999},
        summary: {
            type: Function,
            default: function (h, {plc}) {
                return plc.props.summaryText
            }
        },
        default: {
            type: Function,
            default: function (h, {rowData, plc}) {
                return rowData.index + 1
            }
        },
        head: {
            type: Function,
            default: function () {
                return '#'
            }
        },
    },
    data() {
        return {
            items: {},
            selected: [],

            onClick: (rowData) => {
                // @ts-ignore
                this.selected.push(rowData.key)
                // @ts-ignore
                console.log(this.selected)
            },
        }
    },
})