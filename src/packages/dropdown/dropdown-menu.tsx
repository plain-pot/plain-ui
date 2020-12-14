import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import Dropdown from './dropdown'

export default designComponent({
    name: 'pl-dropdown-menu',
    props: {},
    emits: {
        onClickOption: (e: MouseEvent, val: any) => true,
    },
    provideRefer: true,
    setup({props, event: {emit}}) {

        const dropdown = Dropdown.use.inject()
        const {slots} = useSlots()

        const handler = {
            clickOption: (e: MouseEvent, val: any) => {
                emit.onClickOption(e, val)
                dropdown.handler.clickDropdownOption(e)
            }
        }

        return {
            refer: {
                handler,
            },
            render: slots.default
        }
    },
})