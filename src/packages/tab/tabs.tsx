import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {TabHeadPosition, TabHeadType} from "./tabs.utils";
import {useModel} from "../../use/useModel";
import {useSlots} from "../../use/useSlots";


export const PlTabs = designComponent({
    name:'pl-tabs',
    props: {
        modelValue: {type: [String, Number]},
        headType: {type: String as PropType<TabHeadType>, default: TabHeadType.text},
        headPosition: {type: String as PropType<TabHeadType>, default: TabHeadPosition.top},
        closeable: {type: Boolean},
    },
    emits: {
        updateModelValue: (val?: string | number) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots()
        const model = useModel(() => props.modelValue, emit.updateModelValue)

        return {
            render: () => {
                return (
                    <div class="pl-tabs">
                        <div class="pl-tabs-body">
                            {slots.default()}
                        </div>
                    </div>
                )
            }
        }
    },
})