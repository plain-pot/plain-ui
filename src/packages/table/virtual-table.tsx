import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export const VirtualTable = designComponent({
    name: 'pl-virtual-table',
    props: {},
    setup({props}) {
        const {slots} = useSlots()
        return {
            render: () => slots.default()
        }
    },
})