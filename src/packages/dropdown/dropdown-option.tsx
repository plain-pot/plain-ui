import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-dropdown-option',
    props: {
        label: {type: [String]},
        val: {},
        icon: {type: String},
        disabled: {type: Boolean}
    },
    emits: {
        click: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots()

        const onClick = (e: MouseEvent) => {
            emit.click(e)
        }

        return {
            render: () => (
                <div class="pl-dropdown-option" onClick={onClick}>
                    {!!props.icon && <pl-icon icon={props.icon}/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})