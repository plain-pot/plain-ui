import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-select-group',
    setup() {

        const {slots} = useSlots()

        return {
            render: () => {
                return (
                    <div>
                        {slots.default()}
                    </div>
                )
            }
        }
    },
})