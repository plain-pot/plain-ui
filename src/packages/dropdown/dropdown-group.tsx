import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import Dropdown from './dropdown'

export default designComponent({
    name: 'pl-dropdown-group',
    props: {},
    setup({props}) {

        const dropdown = Dropdown.use.inject()
        const {slots} = useSlots()
        dropdown.state.dropdownGroupSlot = slots.default

        return {
            render: () => null
        }
    },
})