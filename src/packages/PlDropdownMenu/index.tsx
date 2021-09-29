import {designComponent} from "plain-ui-composition";
import PlDropdown from "../PlDropdown";

export const PlDropdownMenu = designComponent({
    name: 'pl-dropdown-menu',
    props: {},
    emits: {
        onClickOption: (e: MouseEvent, val: any) => true,
    },
    slots: ['default'],
    provideRefer: true,
    setup({props, slots, event: {emit}}) {

        const dropdown = PlDropdown.use.inject()

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

export default PlDropdownMenu
