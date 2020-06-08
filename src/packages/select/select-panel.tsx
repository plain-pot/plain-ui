import {computed, defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR, SelectUtils} from "@/packages/select/select-utils";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {SelectOptionCtxType} from "@/packages/select/select-option";
import {useRefer} from "@/use/useRefer";

export const SELECT_PANEL_PROVIDER = '@@SELECT_PANEL_PROVIDER'

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

        const {emit} = useEvent({
            input: EmitFunc,
            click: EmitFunc,
        })

        const {slots} = useSlots()

        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_COLLECTOR})
        const formatData = computed(() => SelectUtils.formatItems(items.value))

        const model = useModel(() => props.value, emit.input)

        const utils = {
            /**
             * 用于option判断当前是否已经被选中
             * @author  韦胜健
             * @date    2020/6/8 9:23
             */
            isSelected: (ctx: SelectOptionCtxType) => {
                if (!model.value) return false
                if (!props.multiple) {
                    return (model.value as string) == ctx.val
                } else {
                    return (model.value as string[]).indexOf(ctx.val!) > -1
                }
            }
        }

        const handler = {
            /**
             * 处理点击option的动作
             * @author  韦胜健
             * @date    2020/6/8 9:24
             */
            clickOption: (ctx: SelectOptionCtxType) => {
                emit.click(ctx)

                if (!props.multiple) {
                    model.value = ctx.val
                } else {
                    const newValue: string[] = (model.value as string[]) || []
                    newValue.push(ctx.val!)
                    model.value = [...newValue]
                }
            }
        }

        const methods = {
            /**
             * 高亮上一个元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            highlightPrev: () => {
                console.log('highlightPrev')
            },
            /**
             * 高亮下一个元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            highlightNext: () => {
                console.log('highlightNext')
            },
            /**
             * 选中当前高亮的元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            selectHighlight: () => {
                console.log('selectHighlight')
            },
        }

        const refer = {
            props,
            utils,
            handler,
            methods,
        }

        provide(SELECT_PANEL_PROVIDER, refer)
        useRefer(refer)

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