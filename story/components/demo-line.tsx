import {designComponent} from "../../src/use/designComponent";
import {useSlots} from "../../src/use/useSlots";

export const DemoLine = designComponent({
    name: 'demo-line',
    props: {
        title: {type: String},
        labelWidth: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots()

        return {
            render: () => (
                <div class="demo-line">
                    {!!props.title && <span class="demo-line-title">{props.title}</span>}
                    <div class="demo-line-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})