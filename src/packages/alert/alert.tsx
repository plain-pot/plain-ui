import {designComponent} from "../../use/designComponent";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {DEFAULT_STATUS, STATUS} from "../../utils/constant";
import {computed} from 'vue';
import './alert.scss'

export default designComponent({
    name: 'pl-alert',
    props: {
        ...StyleProps,

        label: {type: String},                                      // 提示文本
        desc: {type: String},                                       // 描述文本
        align: {type: String, default: 'left'},                     // 文本对其方式
        theme: {type: String, default: 'lite'},                     // 主题，lite轻色，deep深色
        noClose: {type: Boolean},                                   // 禁用关闭
        icon: {type: String, default: undefined},                   // 显示的图标
    },
    setup({props}) {

        const {slots} = useSlots([
            'desc',
            'close',
        ], true)

        const {styleComputed} = useStyle({status: StyleStatus.info})

        const icon = computed(() => {
            if (props.icon === null) {
                return null
            }
            return props.icon || STATUS[styleComputed.value.status!].icon
        })
        const classes = computed(() => [
            'pl-alert',
            `pl-alert-status-${styleComputed.value.status}`,
            `pl-alert-shape-${styleComputed.value.shape}`,
            `pl-alert-theme-${props.theme}`,
            {
                'pl-alert-has-icon': !!icon.value,
                'pl-alert-has-desc': !!props.desc || slots.desc.isExist(),
            }
        ])

        return {
            render: () => (
                <div class={classes.value}>
                    {!!icon.value && <div class="pl-alert-icon">
                        <pl-icon icon={icon.value}/>
                    </div>}
                    {(!!props.label || slots.default.isExist()) && (
                        <div class="pl-alert-label">
                            {slots.default(props.label)}
                        </div>
                    )}
                    {(!!props.desc || slots.desc.isExist()) && (
                        <div class="pl-alert-desc">
                            {slots.desc(props.desc)}
                        </div>
                    )}
                </div>
            )
        }

    },
})