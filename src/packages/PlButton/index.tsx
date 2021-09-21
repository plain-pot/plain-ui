import {designComponent} from "plain-ui-composition";
import {ButtonHTMLAttributes} from 'vue'

export const PlButton = designComponent({
    inheritPropsType: {} as ButtonHTMLAttributes,
    props: {
        label: {type: String},
        status: {type: String},
        mode: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <button>
                {slots.default(props.label)}
            </button>
        )
    },
})

export default PlButton