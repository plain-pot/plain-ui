import {designComponent} from "../../../../src/use/designComponent";
import {useSlots} from "../../../../src/use/useSlots";
import {DemoUseCollector} from "./demo-use-collect-parent";

export const DemoUseCollectChildComponent = designComponent({
    props: {
        childName: {type: String}
    },
    setup({props}) {
        const {slots} = useSlots()

        const parent = DemoUseCollector.child()

        return {
            refer: {
                props,
                IAmChild: true,
            },
            render: () => (
                <div>
                    {slots.default()}
                </div>
            )
        }
    },
})