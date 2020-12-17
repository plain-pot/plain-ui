import {designComponent} from "../../../../use/designComponent";
import {useSlots} from "../../../../use/useSlots";

export default designComponent({
    name: 'plc-collector',
    setup() {
        const {slots} = useSlots()
        return {
            render: () => (
                <div class="plc-collector">
                    {slots.default()}
                </div>
            )
        }
    },
})