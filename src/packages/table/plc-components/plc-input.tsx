import Plc from '../plc/plc'
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    ...Plc,
    name: 'plc-input',
    props: {
        ...Plc.props,

        edit: {
            default: () => function (h, {rowData, plc}) {
                return (
                    <pl-input value={rowData.data[plc.props.field]}/>
                )
            }
        },
    },
})