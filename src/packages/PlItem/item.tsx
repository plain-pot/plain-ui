import {designComponent} from "plain-ui-composition";

export const PlItem = designComponent({
    name: 'pl-item',
    props: {
        block: {type: Boolean},
        tag: {type: String, default: 'div'},
    },
    slots: ['default'],
    setup({props, slots}) {
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
