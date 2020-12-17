import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {useSlots} from "../../../../use/useSlots";
import {PlcGroup} from "./plc.type";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcProps,
    },
    setup({props}) {

        const {slots} = useSlots()

        TablePlcCollector.useChild()
        const {children} = TablePlcCollector.useParent()

        const group: PlcGroup = {
            group: true,
            children,
        }

        return {
            refer: group,
            render: () => (
                <div>
                    {slots.default()}
                </div>
            )
        }
    },
})