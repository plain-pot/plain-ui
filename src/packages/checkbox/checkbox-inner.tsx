import {designComponent} from "../../use/designComponent";
import {useClass} from "../../use/useClasses";

export enum CheckboxStatus {
    uncheck = 'uncheck',
    check = 'check',
    minus = 'minus',
}

export default designComponent({
    name: 'pl-checkbox-inner',
    props: {
        disabled: {type: Boolean},
        checkStatus: {type: String},
    },
    setup({props}) {

        const classes = useClass(() => [
            'pl-checkbox-inner',
            `pl-checkbox-inner-status-${props.checkStatus}`,
            {
                'pl-checkbox-inner-disabled': props.disabled,
            }
        ])

        return {
            render: () => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class={classes.value}>
                    {props.checkStatus === CheckboxStatus.check && <polyline points="22,50 45,75 75,25" class="pl-checkbox-inner-check-polyline"/>}
                    {props.checkStatus === CheckboxStatus.minus && <rect x="15" y="15" width="70" height="70" class="pl-checkbox-inner-minus-polyline"/>}
                </svg>
            )
        }
    },
})