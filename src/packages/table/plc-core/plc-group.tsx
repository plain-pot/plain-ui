import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {PlcGroupProps} from "./plc.utils";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup({props}) {

        const {slots} = useSlots()

        return {
            render: () => slots.default()
        }
    },
})