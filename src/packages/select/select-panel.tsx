import {computed, defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER, SelectUtils} from "@/packages/select/select-utils";

export const I_AM_SELECT_PANEL = '@@I_AM_SELECT_PANEL'

export default defineComponent({
    name: 'pl-select-panel',
    props: {
        value: {type: [String, Array]},                         // 当前双向绑定值

        multiple: {type: Boolean},                              // 是否多选
        multipleLimit: {type: Number},                          // 多选最多选择个数

        noMatchText: {type: Boolean, default: '暂无匹配数据'},    // 筛选无数据时展示的文本
        noDataText: {type: Boolean, default: '暂无数据'},         // 无数据时显示的文本

        showDebug: {type: Boolean},                             // 是否展示调试内容
    },
    setup(props) {

        const {slots} = useSlots()
        provide(I_AM_SELECT_PANEL, true)

        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_PROVIDER})
        const formatData = computed(() => SelectUtils.formatItems(items.value))

        return () => (
            <div class="pl-select-panel">
                {slots.default()}

                {
                    !!props.showDebug && (
                        <div class="pl-select-panel-debug">
                            {formatData.value.map((item, index) => (
                                <div>{index}-{item.label}-{item.val}</div>
                            ))}
                        </div>
                    )
                }
            </div>
        )
    },
})