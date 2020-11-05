import {designComponent} from "../../use/designComponent";
import {MessageServiceOption} from "./index";
import {useClass} from "../../use/useClasses";
import {nextIndex} from "../../utils/nextIndex";

export default designComponent({
    name: 'pl-message',
    props: {
        option: {type: Object as any as new() => MessageServiceOption, required: true}
    },
    setup({props}) {

        const classes = useClass(() => [
            'pl-message',
            `pl-message-status-${props.option.status || 'dark'}`
        ])
        const styles = {zIndex: nextIndex()}

        return {
            render: () => (
                <div class={classes.value} style={styles}>
                    {!!props.option.icon && <pl-icon icon={props.option.icon}/>}
                    <div class="pl-message-content">{props.option.message}</div>
                    <pl-icon icon="el-icon-close" class="pl-message-close"/>
                </div>
            )
        }
    }
    ,
})