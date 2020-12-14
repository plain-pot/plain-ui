import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import Menu from './dropdown-menu'
import {useClass} from "../../use/useClasses";

export default designComponent({
    name: 'pl-dropdown-option',
    props: {
        label: {type: [String]},
        val: {},
        icon: {type: String},
        disabled: {type: Boolean},
        align: {type: String, default: 'left'},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots()
        const menu = Menu.use.inject()

        const onClick = (e: MouseEvent) => {
            if (props.disabled) {
                return
            }
            emit.onClick(e)
            menu.handler.clickOption(e, props.val)
        }

        const classes = useClass(() => [
            'pl-dropdown-option',
            `pl-dropdown-option-align-${props.align}`,
            {
                'pl-dropdown-option-disabled': props.disabled
            }
        ])

        return {
            render: () => (
                <div class={classes.value} onClick={onClick}>
                    {!!props.icon && <pl-icon icon={props.icon} class="pl-dropdown-option-icon"/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})