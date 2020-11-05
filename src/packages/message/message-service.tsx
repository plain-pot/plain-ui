import {designComponent} from "../../use/designComponent";
import {MessageServiceOption} from "./index";
import {useClass} from "../../use/useClasses";

export default designComponent({
    name: 'pl-message-service',
    props: {
        option: {type: Object as any as new() => MessageServiceOption, required: true}
    },
    setup({props}) {

        const classes = useClass(() => [
            'pl-message-service',
            `pl-message-service-status-${props.option.status || 'black'}`
        ])

        return {
            render: () => (
                <div class={classes.value}>

                    <pl-icon/>
                    {props.option.message}
                </div>
            )
        }
    },
})