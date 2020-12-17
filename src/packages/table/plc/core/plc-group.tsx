import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {useSlots} from "../../../../use/useSlots";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcProps,
    },
    setup({props}) {

        const {slots} = useSlots()

        TablePlcCollector.useChild()
        TablePlcCollector.useParent()

        return {
            render: () => (
                <div>
                    {slots.default()}
                </div>
            )
        }
    },
})