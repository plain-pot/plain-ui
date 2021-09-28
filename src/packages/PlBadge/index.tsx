import './badge.scss'
import {computed, designComponent, useRefs} from "plain-design-composition";
import {useClasses} from "plain-design-composition";

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
    inheritPropsType: HTMLDivElement,
    slots: ['default', 'badge'],
    setup({props, slots}) {
        const contentClass = useClasses(() => [
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
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        return {
            refer: {
                refs,
            },
            render: () => (
                <div class="pl-badge" ref={onRef.el}>
                    {slots.default()}
                    <div class={contentClass.value}>
                        {!props.dot && slots.badge(props.data != null ? <span>{showValue.value as any}</span> : null)}
                    </div>
                </div>
            )
        }
    },
})

export default PlBadge
