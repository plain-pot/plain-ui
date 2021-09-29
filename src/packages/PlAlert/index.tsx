import {computed, designComponent, PropType, reactive, useClasses, useRefs} from "plain-ui-composition";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {STATUS} from "../../utils/constant";
import PlIcon from "../PlIcon";
import './alert.scss'
import PlCollapseTransition from "../PlCollapseTransition";

export const PlAlert = designComponent({
    name: 'pl-alert',
    inheritAttrs: false,
    inheritPropsType: HTMLDivElement,
    props: {
        ...StyleProps,

        label: {type: String},                                      // 提示文本
        align: {type: String, default: 'left'},                     // 文本对其方式
        theme: {type: String, default: 'lite'},                     // 主题，lite轻色，deep深色
        noClose: {type: Boolean},                                   // 禁用关闭
        icon: {type: String as PropType<string | null | undefined>, default: undefined},     // 显示的图标
        message: {type: String},                                    // desc内容消息
    },
    slots: ['desc', 'close', 'default'],
    setup({props, slots, attrs}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        const state = reactive({
            isClosed: false,
        })

        const {styleComputed} = useStyle({status: StyleStatus.info})

        const icon = computed(() => {
            if (props.icon === null) {
                return null
            }
            return props.icon || STATUS[styleComputed.value.status!].icon
        })
        const classes = useClasses(() => [
            'pl-alert',
            `pl-alert-status-${styleComputed.value.status}`,
            `pl-alert-shape-${styleComputed.value.shape}`,
            `pl-alert-theme-${props.theme}`,
            `pl-alert-align-${props.align}`,
            {
                'pl-alert-has-icon': !!icon.value,
                'pl-alert-has-desc': !!props.message || slots.desc.isExist(),
                'pl-alert-has-close': !props.noClose,
            }
        ])

        const handler = {
            onClickClosed: () => {
                state.isClosed = true
            }
        }

        return {
            refer: {
                refs,
            },
            render: () => (
                <PlCollapseTransition>
                    <div class="pl-alert-wrapper" {...attrs} ref={onRef.el} v-show={!state.isClosed}>
                        <div class={classes.value}>
                            {!!icon.value && <div class="pl-alert-icon">
                                <PlIcon icon={icon.value}/>
                            </div>}
                            {!props.noClose && <div class="pl-alert-close" onClick={handler.onClickClosed}>
                                {slots.close(<PlIcon icon="el-icon-close"/>)}
                            </div>}
                            {(!!props.label || slots.default.isExist()) && (
                                <div class="pl-alert-label">
                                    {slots.default(props.label)}
                                </div>
                            )}
                            {(props.message || slots.desc.isExist()) && (
                                <div class="pl-alert-desc">
                                    {slots.desc(props.message)}
                                </div>
                            )}
                        </div>
                    </div>
                </PlCollapseTransition>
            )
        }

    },
})

export default PlAlert
