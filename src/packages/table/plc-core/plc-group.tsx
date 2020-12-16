import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {PlcGroupProps} from "./plc.utils";
import {PlcCollector} from "./plc-collector";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup({props}) {

        const {slots} = useSlots()
        const {children} = PlcCollector.parent()
        PlcCollector.child()

        return {
            refer: {
                children
            },
            render: () => (<div class="plc-group">{slots.default()}</div>)
        }
    },
})