import {computed, designComponent, PropType, reactive, useRefs} from "plain-ui-composition";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {STATUS} from "../../utils/constant";
import {useClasses} from "plain-ui-composition";

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
                'pl-alert-has-desc': slots.desc.isExist(),
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
                <PlCollapseTransition show={!state.isClosed}>
                    <div class="pl-alert-wrapper" {...attrs} ref={onRef.el}>
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
                            {(slots.desc.isExist()) && (
                                <div class="pl-alert-desc">
                                    {slots.desc()}
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
