import {computed} from "vue";
import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './button.scss'

console.log('load button component')

export const Button = designComponent({
    name: 'pl-button',
    props: {
        label: String,
        status: {type: String, default: 'primary'},
    },
    setup({props, event}) {

        const {slots} = useSlots()

        const classes = computed(() => [
            'pl-button',
            `pl-button-status-${props.status}`
        ])

        return {
            refer: {},
            render: () => {
                return (
                    <button class={classes.value}>
                        {slots.default(props.label)}
                    </button>
                )
            }
        }
    },
})