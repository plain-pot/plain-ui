import Plc from '../plc/plc'
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    ...Plc,
    name: 'plc-toggle',
    props: {
        ...Plc.props,

        summary: {
            default: () => () => null
        },
        default: {
            default: () => function (h, {rowData, plc}) {
                return (
                    <pl-toggle disabled/>
                )
            }
        },
        edit: {
            default: () => function (h, {rowData, plc}) {
                return (
                    <plc-toggle/>
                )
            }
        },
    },
})