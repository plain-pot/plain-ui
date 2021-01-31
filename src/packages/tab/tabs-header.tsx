import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {TabData} from "./tabs.utils";

export const PlTabsHeader = designComponent({
    props: {
        tabs: {type: Array as PropType<TabData[]>, required: true},
    },
    emits: {
        onClickTabHead: (tab: TabData) => true,
    },
    setup({props, event: {emit}}) {
        return {
            render: () => (
                <div class="pl-tabs-header">
                    <div class="pl-tabs-header-list">
                        {props.tabs.map((tab, index) => (
                            <div class={[
                                'pl-tabs-header-item',
                                {'pl-tabs-header-item-active': tab.active}
                            ]} key={index}
                                 onClick={() => emit.onClickTabHead(tab)}
                            >
                                {tab.item.scopedSlots.head({active: false}, tab.item.props.title)}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    },
})