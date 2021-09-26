import {designComponent, useClasses, useRefs} from "plain-ui-composition";

export const PlDropdownGroup = designComponent({
    name: 'pl-dropdown-group',
    slots: ['default', 'title'],
    inheritPropsType: HTMLDivElement,
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const classes = useClasses(() => [
            'pl-dropdown-group',
            {'pl-dropdown-no-title': !slots.title.isExist()}
        ])

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {slots.title.isExist() && (
                        <div class="pl-dropdown-group-title">
                            <span>{slots.title()}</span>
                        </div>
                    )}
                    <div class="pl-dropdown-group-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})

export default PlDropdownGroup
