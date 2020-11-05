import {designComponent} from "../../use/designComponent";
import {MessageServiceOption} from "./index";
import {useClass} from "../../use/useClasses";
import {nextIndex} from "../../utils/nextIndex";

export default designComponent({
    name: 'pl-message',
    props: {
        option: {type: Object as any as new() => MessageServiceOption, required: true}
    },
    emits: {
        close: () => true
    },
    setup({props, event: {emit}}) {

        const classes = useClass(() => [
            'pl-message',
            `pl-message-status-${props.option.status || 'dark'}`
        ])
        const styles = {zIndex: nextIndex()}

        const close = () => {
            emit.close()
            !!props.option.onClose && props.option.onClose()
        }

        props.option.close = close

        const handler = {
            onClickCloseIcon: (e: MouseEvent) => {
                close()
                !!props.option.onClick && props.option.onClick(e)
            }
        }

        console.log('show', Date.now())

        return {
            render: () => (
                <div class={classes.value} style={styles}>
                    {!!props.option.icon && <pl-icon icon={props.option.icon}/>}
                    <div class="pl-message-content">{props.option.message}</div>
                    <pl-icon icon="el-icon-close" class="pl-message-close" onClick={handler.onClickCloseIcon}/>
                </div>
            )
        }
    }
    ,
})