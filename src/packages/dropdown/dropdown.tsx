import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-dropdown',
    props: {},
    setup({props, event}) {

        const {slots} = useSlots()

        return {
            render: () => (
                <>
                    {slots.default()}

                </>
            )
        }
    },
})