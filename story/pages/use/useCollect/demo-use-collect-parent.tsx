import {designComponent} from "../../../../src/use/designComponent";
import {useSlots} from "../../../../src/use/useSlots";
import {useCollect} from "../../../../src/use/useCollect";
import {DemoUseCollectChildComponent} from "./demo-use-collect-child";

export const DemoUseCollectParentComponent = designComponent({
    props: {
        parentName: {type: String}
    },
    setup({props}) {
        const {slots} = useSlots()

        const children = DemoUseCollector.parent()

        return {
            refer: {
                props,
                IAmParent: true,
            },
            render: () => (
                <div>
                    {slots.default()}
                </div>
            )
        }
    },
})

export const DemoUseCollector = useCollect({parent: DemoUseCollectParentComponent, child: DemoUseCollectChildComponent})