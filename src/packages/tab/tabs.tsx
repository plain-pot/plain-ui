import {designComponent} from "../../use/designComponent";
import {PropType, onMounted, computed} from 'vue';
import {TabData, TabHeadPosition, TabHeadType} from "./tabs.utils";
import {useModel} from "../../use/useModel";
import {useSlots} from "../../use/useSlots";
import {useCollect} from "../../use/useCollect";
import {PlTab, PlTabComponent} from "./tab";
import {PlTabsHeader} from "./tabs-header";
import './tab.scss'
import {PlInnerTab} from "./inner-tab";

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

        const tabs = computed(() => items.map((item, index) => ({
            item,
            index,
            active: (() => {
                const {val} = item.props
                if (val != null) {
                    return model.value == val
                }
                if (model.value != null) {
                    return model.value == index
                }
                return index == 0
            })(),
        })))

        const handler = {
            onClickTabHeader: ({item, index, active}: TabData) => {
                const {props: {val}} = item
                if (active) {return}
                model.value = val == null ? index : val
            }
        }

        onMounted(() => {
            // console.log(items, model)
        })

        return {
            render: () => {
                return (
                    <div class="pl-tabs">
                        <div class="pl-tabs-collector">{slots.default()}</div>
                        <PlTabsHeader tabs={tabs.value} onClickTabHead={handler.onClickTabHeader}/>
                        <div class="pl-tabs-body">
                            {tabs.value.map((tab, index) => (
                                <PlInnerTab item={tab.item} key={index} active={tab.active}/>
                            ))}
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