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
                    {!!props.title && <div class="demo-line-title"><span>{props.title}</span></div>}
                    <div class="demo-line-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})