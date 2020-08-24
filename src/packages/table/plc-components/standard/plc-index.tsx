import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-index',
    props: {
        // custom
        summaryText: {type: String, default: '合计'},

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9999},
        width: {default: 40},
        align: {default: 'center'},
        noPadding: {type: Boolean, default: true},
        summary: {
            type: Function,
            default: function ({plc}) {
                return plc.props.summaryText
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}) {
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
})