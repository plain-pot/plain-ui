import {createEventListener, designComponent, nextIndex, PropType, useClasses} from 'plain-ui-composition'
import './PlMessage.scss'
import {MessageServiceFormatOption} from "./index";
import {PlIcon} from "../PlIcon";

export default designComponent({
    name: 'pl-message',
    props: {
        option: {type: Object as PropType<MessageServiceFormatOption>, required: true}
    },
    emits: {
        onClose: () => true
    },
    setup({props, event: {emit}}) {

        const classes = useClasses(() => [
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
            onClickCloseIcon: () => {
                close()
            },
            onMouseenter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                }
            },
            onMouseleave: () => {
                !!props.option.time && (closeTimer = setTimeout(close, props.option.time) as any)
            }
        }

        let closeTimer: number | null = null
        !!props.option.time && (closeTimer = setTimeout(close, props.option.time) as any)

        return {
            refer: {
                props,
            },
            render: () => (
                <div class={classes.value}
                     style={styles}
                     onMouseenter={handler.onMouseenter}
                     onMouseleave={handler.onMouseleave}
                     onClick={handler.onClick}>
                    {!!props.option.icon && <PlIcon icon={props.option.icon}/>}
                    <div class="pl-message-content">{!!props.option.render ? props.option.render() : props.option.message}</div>
                    <div class="pl-message-close">
                        <PlIcon icon="el-icon-close" {...createEventListener({onClick: handler.onClickCloseIcon})}/>
                    </div>
                </div>
            )
        }
    },
})
