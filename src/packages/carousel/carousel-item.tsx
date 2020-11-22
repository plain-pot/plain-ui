import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-carousel-item',
    props: {},
    setup({props}) {

        const {slots} = useSlots()

        return {
            render: () => (
                <div class="pl-carousel-item">
                    {slots.default()}
                </div>
            )
        }
    },
})