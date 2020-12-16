import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {PlcGroupProps} from "./plc.utils";
import {PlcCollector} from "./plc-collector";
import {ComponentPublicInstance} from 'vue';

const PlcGroupComponent = designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup({props}) {

        const {slots} = useSlots()
        const {children} = PlcCollector.parent() as any as { children: ComponentPublicInstance[] }
        const {ctx} = PlcCollector.child()

        return {
            refer: {
                children,
                group: true,
            },
            render: () => (<div class="plc-group">{slots.default()}</div>)
        }
    },
})

export type PlcGroup = typeof PlcGroupComponent.use.class

export default PlcGroupComponent