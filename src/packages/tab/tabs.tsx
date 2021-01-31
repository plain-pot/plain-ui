import {designComponent} from "../../use/designComponent";
import {PropType, onMounted} from 'vue';
import {TabHeadPosition, TabHeadType} from "./tabs.utils";
import {useModel} from "../../use/useModel";
import {useSlots} from "../../use/useSlots";
import {useCollect} from "../../use/useCollect";
import {PlTab} from "./tab";
import {PlTabsHeader} from "./tabs-header";
import './tab.scss'

export const PlTabs = designComponent({
    name: 'pl-tabs',
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
        const items = TabCollector.parent()

        onMounted(() => {
            console.log(items, model)
        })

        return {
            render: () => {
                return (
                    <div class="pl-tabs">
                        <div class="pl-tabs-collector">{slots.default()}</div>
                        <PlTabsHeader tabs={items}/>
                        <div class="pl-tabs-body">
                            
                        </div>
                    </div>
                )
            }
        }
    },
})

export const TabCollector = useCollect(() => ({
    parent: PlTabs,
    child: PlTab,
}))