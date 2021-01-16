import './list.scss'
import {designComponent} from "../../use/designComponent";
import {TransitionGroup} from 'vue'
import {useSlots} from "../../use/useSlots";

export const PlList = designComponent({
    name: 'pl-list',
    props: {
        direction: {                            //item入场出场动画 'left', 'right', 'top', 'bottom', 'left-top', 'top-left', 'right-top', 'top-right', 'left-bottom', 'bottom-left', 'right-bottom', 'bottom-right'
            type: String,
            default: 'bottom-right',
        },
        tag: {type: String, default: 'div'},
        disabled: {type: Boolean},
    },
    setup({props}) {
        const {slots} = useSlots()
        return {
            render: () => {
                const Component = (props.disabled ? props.tag : TransitionGroup) as any
                return (
                    <Component {...{
                        class: "pl-list",
                        name: `pl-list-move-${props.direction}`,
                        tag: props.tag,
                    }}>
                        {slots.default()}
                    </Component>
                )
            }
        }
    }
})