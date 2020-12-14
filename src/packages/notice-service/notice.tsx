import {designComponent} from "../../use/designComponent";
import {NoticeServiceFormatOption} from "./index";
import {useClass} from "../../use/useClasses";
import {nextIndex} from "../../utils/nextIndex";
import './notice-service.scss'
import {PropType} from 'vue';
import Icon from '../icon'
import Button from '../button'

export default designComponent({
    name: 'pl-notice',
    props: {
        option: {type: Object as PropType<NoticeServiceFormatOption>, required: true}
    },
    emits: {
        onClose: () => true
    },
    setup({props, event: {emit}}) {
        const classes = useClass(() => [
            'pl-notice',
            `pl-notice-status-${props.option.status}`
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
                    <div class="pl-notice-head">
                        {!!props.option.icon && <Icon class="pl-notice-head-icon" icon={props.option.icon}/>}
                        {(!!props.option.renderHead || !!props.option.title) && (
                            <div class="pl-notice-title">
                                {!!props.option.renderHead ? props.option.renderHead() : props.option.title}
                            </div>
                        )}
                        {!props.option.noClose && (
                            <Button mode="text" icon="el-icon-close" class="pl-notice-close" onClick={handler.onClickCloseIcon}/>
                        )}
                    </div>
                    {(!!props.option.renderContent || !!props.option.message) && (
                        <div class="pl-notice-content">
                            {!!props.option.renderContent ? props.option.renderContent() : props.option.message}
                        </div>
                    )}
                    {!!props.option.renderFoot && (
                        <div class="pl-notice-foot">
                            {props.option.renderFoot()}
                        </div>
                    )}
                </div>
            )
        }
    },
})