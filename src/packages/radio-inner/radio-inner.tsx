import {designComponent} from "../../use/designComponent";
import {useClass} from "../../use/useClasses";
import './radio-inner.scss'

export const PlRadioInner = designComponent({
    name: 'pl-radio-inner',
    props: {
        checkStatus: {type: String},                // check,uncheck
    },
    setup({props}) {

        const classes = useClass(() => [
            'pl-radio-inner',
            `pl-radio-inner-${props.checkStatus}`,
        ])

        return {
            render: () => (
                <svg class={classes.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    {props.checkStatus === 'check' && <circle cx="50" cy="50" r="30"/>}
                </svg>
            )
        }
    },
})