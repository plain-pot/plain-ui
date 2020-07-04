import Plc from '../plc/plc'
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    ...Plc,
    name: 'plc-index',
    props: {
        ...Plc.props,

        // custom props
        summaryText: {type: String, default: '合计'},

        // standard props
        autoFixedLeft: {default: true},
        order: {default: -9999},

        summary: {
            default: () => function (h, {plc}) {
                return plc.props.summaryText
            }
        },
        default: {
            default: () => function (h, {rowData, plc}) {
                return (
                    <div>{rowData.index + 1}</div>
                )
            }
        },
        head: {
            default: () => function () {
                return '#'
            }
        },
    },
})