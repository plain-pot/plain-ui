import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import Dropdown from './dropdown'

export default designComponent({
    name: 'pl-dropdown-menu',
    props: {},
    emits: {
        clickOption: (e: MouseEvent, val: any) => true,
    },
    provideRefer: true,
    setup({props, event: {emit}}) {

        const dropdown = Dropdown.use.inject()
        const {slots} = useSlots()
        dropdown.state.dropdownGroupSlot = slots.default

        const handler = {
            clickOption: (e: MouseEvent, val: any) => {
                emit.clickOption(e, val)
                dropdown.handler.clickOptoin(e)
            }
        }

        return {
            refer: {
                handler,
            },
            render: () => null
        }
    },
})