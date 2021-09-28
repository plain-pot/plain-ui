import {designComponent, useClasses} from "plain-design-composition";
import './input-group.scss'

export const PlInputGroup = designComponent({
    props: {
        block: {type: Boolean}
    },
    slots: ['default'],
    setup({props, slots}) {

        const classes = useClasses(() => [
            'pl-input-group',
            {'pl-input-group-block': props.block}
        ])

        return () => (
            <div class={classes.value}>
                {slots.default()}
            </div>
        )
    },
})

export default PlInputGroup
