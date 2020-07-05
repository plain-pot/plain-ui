import {plcSetup} from '../plc/plc'
import {defineComponent} from "@vue/composition-api";
import {PlcProps} from "@/packages/table/plc/plc-utils";

export default defineComponent({
    name: 'plc-input',
    props: {
        ...PlcProps,
        edit: {
            default: () => function (h, {rowData, plc}) {
                return (
                    <pl-input value={rowData.data[plc.props.field]} block/>
                )
            }
        },
    },
    setup: plcSetup as any,
})