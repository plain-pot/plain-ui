import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {computed} from 'vue';
import './badge.scss'

export const PlBadge = designComponent({
    name: 'pl-badge',
    props: {
        data: {},                                       //显示的数据
        bottom: {type: Boolean},                        //标记纵向是否在底部
        start: {type: Boolean},                         //标记横向是否在右边
        status: {type: String, default: 'error'},       //标记背景色
        dot: {type: Boolean,},                          //标记是否只是一个小圆点
        max: {type: Number,},                           //标记显示文本最大值
    },
    setup({props}) {
        const {slots} = useSlots(['badge'])
        const contentClass = computed(() => [
            'pl-badge-content',
            {
                'pl-badge-content-dot': !!props.dot,
            },
            `pl-badge-content-${!!props.bottom ? 'bottom' : 'top'}`,
            `pl-badge-content-${!!props.start ? 'start' : 'end'}`,
            `pl-badge-content-status-${props.status}`,
        ])
        const showValue = computed(() => {
            if (props.data == null) return null
            if (props.max != null && (Number(props.data)) > props.max) return props.max + '+'
            return props.data
        })
        return {
            render: () => (
                <div class="pl-badge">
                    {slots.default()}
                    <div class={contentClass.value}>
                        {slots.badge(props.data != null ? <span>{showValue.value}</span> : null)}
                    </div>
                </div>
            )
        }
    },
})