import {designComponent, useClasses, useRefs} from "plain-ui-composition";
import PlDropdownMenu from "../PlDropdownMenu";
import PlIcon from "../PlIcon";

export const PlDropdownOption = designComponent({
    name: 'pl-dropdown-option',
    props: {
        label: {type: [String]},
        val: {},
        icon: {type: String},
        disabled: {type: Boolean},
        align: {type: String, default: 'left'},
        noWrap: {type: Boolean, default: true},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const menu = PlDropdownMenu.use.inject()

        const onClick = (e: MouseEvent) => {
            if (props.disabled) {
                return
            }
            emit.onClick(e)
            menu.handler.clickOption(e, props.val)
        }

        const classes = useClasses(() => [
            'pl-dropdown-option',
            `pl-dropdown-option-align-${props.align}`,
            {
                'pl-dropdown-option-disabled': props.disabled,
                'pl-dropdown-option-no-wrap': props.noWrap,
            }
        ])

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class={classes.value} onClick={onClick} ref={onRef.el}>
                    {!!props.icon && <PlIcon icon={props.icon} class="pl-dropdown-option-icon"/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})

export default PlDropdownOption
