import {designComponent} from "plain-ui-composition";

export const PlCollapseTransition = designComponent({
    props: {
        show: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {
        //todo collapse transition
        return () => (
            <div>
                {slots.default()}
            </div>
        )
    },
})

export default PlCollapseTransition
