import {designComponent} from "plain-design-composition"

export const DemoLine = designComponent({
    name: 'demo-line',
    props: {
        title: {type: String},
        labelWidth: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {

        return {
            render: () => (
                <div class="demo-line">
                    {!!props.title && <div class="demo-line-title"><span>{props.title}</span></div>}
                    <div class="demo-line-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})
