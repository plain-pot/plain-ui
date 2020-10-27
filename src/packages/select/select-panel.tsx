import {computed, defineComponent, getCurrentInstance, provide, ref} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR, SelectUtils} from "@/packages/select/select-utils";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {SelectOptionCtxType} from "@/packages/select/select-option";
import {useRefer} from "@/use/useRefer";

import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";
import {PlainScroll} from "@/packages/scroll/scroll";

const Props = {
    value: {type: [String, Array]},                                 // 当前双向绑定值

    multiple: {type: Boolean},                                      // 是否多选
    multipleMaxLimit: {type: Number},                               // 多选最多选择个数
    multipleMinLimit: {type: Number},                               // 多选最少选择个数

    noMatchText: {type: Boolean, default: '暂无匹配数据'},            // 筛选无数据时展示的文本
    noDataText: {type: Boolean, default: '暂无数据'},                // 无数据时显示的文本
    filterMethod: Function,                                 // 筛选过滤函数
    content: {type: [Object, Function]},                            // 内容虚拟dom或者渲染函数
    height: {type: Number},                                         // 面板高度，超过会显示自定义滚动条

    showDebug: {type: Boolean},                                     // 是否展示调试内容
}

export const SELECT_PANEL_PROVIDER = '@@SELECT_PANEL_PROVIDER'

export function selectPanelSetup(props: ExtractPropTypes<typeof Props>) {
    const {emit} = useEvent({
        input: EmitFunc,
        click: EmitFunc,
    })

    const {slots} = useSlots()
    const refs = useRefs({
        scroll: {} as PlainScroll,
    })

    const highlightOption = ref(null as null | SelectOptionCtxType)
    const items = useCollectParent({sort: true, provideString: SELECT_PANEL_COLLECTOR})
    const formatData = computed(() => SelectUtils.formatItems(items.value))
    const model = useModel(() => props.value, emit.input)

    const classes = computed(() => [
        'pl-select-panel',
        {
            'pl-select-panel-multiple': props.multiple,
        }
    ])

    const showItems = computed(() => formatData.value.filter(utils.isShow))

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
        },
        isShow: (ctx: SelectOptionCtxType) => {
            return !props.filterMethod || props.filterMethod(ctx)
        }
    }
    const handler = {
        /**
         * 处理点击option的动作
         * @author  韦胜健
         * @date    2020/6/8 9:24
         */
        clickOption: (ctx: SelectOptionCtxType) => {

            if (ctx.disabled) return

            emit.click(ctx)

            if (!props.multiple) {
                model.value = ctx.val
            } else {
                const newValue: string[] = [...((model.value as string[]) || [])]
                const index = newValue.indexOf(ctx.val!)
                if (index > -1) {
                    if (!!props.multipleMinLimit && newValue.length <= props.multipleMinLimit) {
                        return $plain.$message.warn(`最少选择 ${props.multipleMinLimit} 个选项`)
                    }
                    newValue.splice(index, 1)
                } else {
                    if (!!props.multipleMaxLimit && newValue.length >= props.multipleMaxLimit) {
                        return $plain.$message.warn(`最多选择 ${props.multipleMaxLimit} 个选项`)
                    }
                    newValue.push(ctx.val!)
                }
                model.value = [...newValue]
            }
        },
    }

    const methods = {
        /**
         * 高亮上一个元素
         * @author  韦胜健
         * @date    2020/6/8 9:18
         */
        highlightPrev: () => {
            if (showItems.value.length === 0) {
                return
            }
            if (!highlightOption.value) {
                highlightOption.value = showItems.value[showItems.value.length - 1]

                // 滚动到高亮的选项
                if (!!refs.scroll) {
                    const el = (highlightOption.value as any).$el
                    refs.scroll.methods.scrollTop(el.offsetTop, 200)
                }
            } else {
                let index = showItems.value.indexOf(highlightOption.value)
                if (index === 0) {
                    index = showItems.value.length - 1
                    highlightOption.value = showItems.value[index]

                    // 滚动到高亮的选项
                    if (!!refs.scroll) {
                        const el = (highlightOption.value as any).$el
                        refs.scroll.methods.scrollTop(el.offsetTop, 200)
                    }
                } else {
                    index--
                    highlightOption.value = showItems.value[index]

                    // 滚动到高亮的选项
                    if (!!refs.scroll) {
                        const el = (highlightOption.value as any).$el
                        const {wrapperScrollTop} = refs.scroll.state
                        if (wrapperScrollTop > el.offsetTop) {
                            refs.scroll.methods.scrollTop(el.offsetTop, 200)
                        }
                    }
                }
            }
        },
        /**
         * 高亮下一个元素
         * @author  韦胜健
         * @date    2020/6/8 9:18
         */
        highlightNext: () => {
            if (showItems.value.length === 0) {
                return
            }
            if (!highlightOption.value) {
                highlightOption.value = showItems.value[0]
            } else {
                let index = showItems.value.indexOf(highlightOption.value)
                if (index === showItems.value.length - 1) {
                    index = 0
                    highlightOption.value = showItems.value[index]

                    // 滚动到高亮的选项
                    if (!!refs.scroll) {
                        refs.scroll.methods.scrollTop(0, 200)
                    }
                } else {
                    index++
                    highlightOption.value = showItems.value[index]

                    // 滚动到高亮的选项
                    if (!!refs.scroll) {
                        const el = (highlightOption.value as any).$el
                        const {hostHeight, wrapperScrollTop} = refs.scroll.state
                        const scrollTop = el.offsetTop + el.offsetHeight - hostHeight
                        if (scrollTop > 0 && scrollTop > wrapperScrollTop) {
                            refs.scroll.methods.scrollTop(scrollTop, 200)
                        }
                    }
                }
            }


        },
        /**
         * 选中当前高亮的元素
         * @author  韦胜健
         * @date    2020/6/8 9:18
         */
        selectHighlight: () => {
            if (showItems.value.length === 0) {
                return
            }
            if (!highlightOption.value) {
                methods.highlightNext()
            }
            if (!!highlightOption.value) {
                handler.clickOption(highlightOption.value)
            }
        },
    }

    const refer = {
        model,
        items,
        formatData,
        emit,
        slots,
        props,
        utils,
        handler,
        methods,
        classes,
        showItems,
        highlightOption,
    }

    provide(SELECT_PANEL_PROVIDER, refer)
    useRefer(refer)

    return refer
}

export type SelectPanelContextType = ReturnType<typeof selectPanelSetup>

export default defineComponent({
    name: 'pl-select-panel',
    props: {
        ...Props,
    },
    setup(props) {

        const {formatData, slots, classes, items, showItems} = selectPanelSetup(props)
        const ctx = getCurrentInstance()!

        const styles = computed(() => !!props.height ? {height: $plain.utils.suffixPx(props.height)} : null)

        return () => {

            const inner = [
                (items.value.length === 0 || showItems.value.length === 0) ? (
                    <div class="pl-select-panel-empty-text">
                        {items.value.length === 0 ? props.noDataText : props.noMatchText}
                    </div>
                ) : null,
                slots.default(),
                !!props.content ? ((typeof props.content === "function" ? props.content(ctx.$createElement) : props.content)) : null,
                !!props.showDebug ? (
                    <div class="pl-select-panel-debug">
                        {formatData.value.map((item, index) => (
                            <div>{index}-{item.label}-{item.val}</div>
                        ))}
                    </div>
                ) : null,
            ].filter(Boolean)

            const content: any = !!props.height ? (
                <pl-scroll fitHostWidth ref="scroll">
                    {inner}
                </pl-scroll>
            ) : inner

            return (
                <div class={classes.value} style={styles.value}>
                    {content}
                </div>
            )
        }
    },
})