import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {PlTab} from "./tab";
import {PlScroll} from "../scroll/scroll";

export const PlTabsHeader = designComponent({
    props: {
        tabs: {type: Array as PropType<(typeof PlTab.use.class)[]>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pl-tabs-header">
                    <PlScroll scrollX={true} scrollY={false}>
                        <div class="pl-tabs-header-list">
                            {props.tabs.map((tab, index) => (
                                <div class="pl-tabs-header-item" key={index}>
                                    {tab.scopedSlots.head({active: false}, tab.props.title)}
                                </div>
                            ))}
                        </div>
                    </PlScroll>
                </div>
            )
        }
    },
})