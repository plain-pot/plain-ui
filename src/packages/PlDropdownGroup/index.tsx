import {designComponent, useClasses,InheritHtmlElement, useRefs} from "plain-ui-composition";

export const PlDropdownGroup = designComponent({
    name: 'pl-dropdown-group',
    props: {
        title: {type: String}
    },
    slots: ['default', 'head'],
    inheritPropsType: InheritHtmlElement,
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const classes = useClasses(() => [
            'pl-dropdown-group',
            {'pl-dropdown-no-title': !slots.head.isExist() && !props.title}
        ])

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {slots.head.isExist() || props.title && (
                        <div class="pl-dropdown-group-title">
                            <span>{slots.head(props.title)}</span>
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
