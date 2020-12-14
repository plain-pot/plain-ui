import {designComponent} from "../../use/designComponent";
import {MessageServiceFormatOption} from "./index";
import {useClass} from "../../use/useClasses";
import {nextIndex} from "../../utils/nextIndex";
import {PropType} from 'vue';

export default designComponent({
    name: 'pl-message',
    props: {
        option: {type: Object as PropType<MessageServiceFormatOption>, required: true}
    },
    emits: {
        onClose: () => true
    },
    setup({props, event: {emit}}) {

        const classes = useClass(() => [
            'pl-message',
            `pl-message-status-${props.option.status}`
        ])
        const styles = {zIndex: nextIndex()}

        const close = () => {
            emit.onClose()
            !!props.option.onClose && props.option.onClose()
        }

        props.option.close = close

        const handler = {
            onClick: (e: MouseEvent) => {
                !!props.option.onClick && props.option.onClick(e)
            },
            onClickCloseIcon: (e: MouseEvent) => {
                close()
            },
            onMouseenter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                }
            },
            onMouseleave: () => {
                !!props.option.time && (closeTimer = setTimeout(close, props.option.time))
            }
        }

        let closeTimer: number | null = null
        !!props.option.time && (closeTimer = setTimeout(close, props.option.time))

        return {
            render: () => (
                <div class={classes.value}
                     style={styles}
                     onMouseenter={handler.onMouseenter}
                     onMouseleave={handler.onMouseleave}
                     onClick={handler.onClick}>
                    {!!props.option.icon && <pl-icon icon={props.option.icon}/>}
                    <div class="pl-message-content">{!!props.option.render ? props.option.render() : props.option.message}</div>
                    {/*<Icon icon="el-icon-close" class="pl-message-close" onClick={handler.onClickCloseIcon}/>*/}
                </div>
            )
        }
    }
    ,
})