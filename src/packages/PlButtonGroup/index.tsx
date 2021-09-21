import {designComponent} from "plain-ui-composition";

export const PlButtonGroup = designComponent({
    props: {
        size: {type: String},
        status: {type: String},
        mode: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <div>
                {slots.default()}
            </div>
        )
    },
})

export default PlButtonGroup