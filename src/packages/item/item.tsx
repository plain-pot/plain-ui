import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-item',
    props: {
        block: {type: Boolean},
        tag: {type: String, default: 'div'},
    },
    setup({props}) {
        const {slots} = useSlots()
        return {
            render: () => {
                const {tag: Tag} = props as any
                return (
                    <Tag {...{class: `pl-item ${!!props.block ? 'pl-item-block' : ''}`}}>
                        {slots.default()}
                    </Tag>
                )
            }
        }
    },
})