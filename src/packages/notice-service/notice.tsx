import {designComponent} from "../../use/designComponent";
import {NoticeServiceFormatOption} from "./index";
import {useClass} from "../../use/useClasses";
import {nextIndex} from "../../utils/nextIndex";

export default designComponent({
    name: 'pl-notice',
    props: {
        option: {type: Object as any as new() => NoticeServiceFormatOption, required: true}
    },
    emits: {
        close: () => true
    },
    setup({props, event: {emit}}) {
        const classes = useClass(() => [
            'pl-notice',
            `pl-notice-status-${props.option.status}`
        ])
        const styles = {zIndex: nextIndex()}
        const close = () => {
            emit.close()
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
                    <pl-icon icon="el-icon-close" class="pl-message-close" onClick={handler.onClickCloseIcon}/>
                </div>
            )
        }
    },
})