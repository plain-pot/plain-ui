import {computed, defineComponent, ref} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR, SelectUtils} from "@/packages/select/select-utils";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {$plain} from "@/packages/base";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {CompRef, useRefs} from "@/use/useRefs";
import {EditProps} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";
import {SelectOptionCtxType} from "@/packages/select/select-option";
import {handleKeyboard} from "@/packages/keyboard";
import {SelectPanelContextType} from "@/packages/select/select-panel";

const Props = {
    ...EditProps,
    ...StyleProps,

    value: {type: [String, Array]},
    filterable: {type: Boolean, default: true},                     // 是否可以输入筛选
    inputProps: {type: Object},                                     // input组件绑定属性对象

    multiple: {type: Boolean},                                      // 是否多选
    multipleMaxLimit: {type: Number},                               // 多选最多选择个数
    multipleMinLimit: {type: Number},                               // 多选最少选择个数
    collapseTags: {type: Boolean, default: true},                   // 多选模式下，超过三个选项，其他的将省略显示

    noMatchText: {type: Boolean, default: '暂无匹配数据'},            // 筛选无数据时展示的文本
    noDataText: {type: Boolean, default: '暂无数据'},                // 无数据时显示的文本
    filterMethod: {type: Function},                                 // 筛选过滤函数
}

export default defineComponent({
    name: 'pl-select',
    props: {
        ...Props,
    },
    setup(props) {

        useStyle({status: null})
        const {slots} = useSlots()
        const refs = useRefs({
            input: CompRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            click: EmitFunc,

            space: EmitFunc,
            enter: EmitFunc,
            up: EmitFunc,
            down: EmitFunc,
            esc: EmitFunc,

            blur: EmitFunc,
            focus: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)
        const filterText = ref(null as string | null)

        const agentState = usePopperAgentEditor(() => ($plain as any).$select(() => {
            return {
                props: {
                    ...(Object.keys(Props).reduce((ret, key) => {
                        ret[key] = props[key]
                        return ret
                    }, {})),

                    value: model.value,
                    height: popperHeight.value,
                    content: () => slots.default(),
                    filterMethod: utils.filterMethod,
                },
                popperProps: {
                    reference: refs.$el,
                    height: popperHeight.value,
                },
                listener: {
                    change: (val) => {
                        model.value = val
                    },
                    click: (option) => {
                        emit.click(option)
                    }
                },
                popperListener: {
                    'mousedown-popper': async () => {
                        agentState.state.focusCounter++
                    },
                    'click-popper': () => {
                        refs.input.methods.focus()
                    },
                    'hide': () => {
                        filterText.value = null
                    },
                }
            }
        }))

        /**
         * 收集的option实例
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const items = useCollectParent({sort: false, provideString: SELECT_PANEL_COLLECTOR})

        /**
         * 递归收集option实例，展开为一级数组
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const formatData = computed(() => SelectUtils.formatItems(items.value) as SelectOptionCtxType[])

        /**
         * 显示值
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const displayValue = computed(() => {
            if (!props.multiple) {
                for (let i = 0; i < formatData.value.length; i++) {
                    const item = formatData.value[i];
                    if (item.val === model.value) {
                        return item.label
                    }
                }
            } else {
                let strings: string[] = []
                if (!!model.value && Array.isArray(model.value)) {
                    for (let i = 0; i < formatData.value.length; i++) {
                        const item = formatData.value[i];
                        if (model.value.indexOf(item.val!) > -1) {
                            strings.push(item.label!)
                        }
                    }
                }
                return strings.join('').trim()
            }
            return null
        })

        const popperHeight = computed(() => formatData.value.length > 6 ? 256 : null)

        const inputProps = computed(() => Object.assign({}, props.inputProps || {}))

        const placeholderValue = computed(() => (agentState.isShow.value ? displayValue.value || inputProps.value.placeholder : inputProps.value.placeholder) || '')

        const inputBinding = computed(() => {
            return {
                ref: 'input',
                class: [
                    'pl-select',
                    {
                        'pl-input-tags': !!props.multiple,
                        'pl-select-input-show': agentState.isShow.value,
                    }
                ],
                props: {
                    ...inputProps.value,

                    value: (props.filterable && agentState.isShow.value) ? filterText.value : displayValue.value,
                    placeValue: displayValue.value,
                    inputReadonly: !props.filterable,
                    placeholder: placeholderValue.value,
                    suffixIcon: 'el-icon-arrow-down',
                    clearIcon: true,
                    isFocus: agentState.state.focusCounter > 0,
                    clearHandler: () => model.value = undefined,
                },
                on: {
                    'input': (val) => {
                        filterText.value = val
                        if (!agentState.isShow.value && !$plain.utils.ie) {
                            agentState.methods.show()
                        }
                    },
                    'click-input': e => {
                        agentState.handler.clickInput()
                    },
                    focus: agentState.handler.focus,
                    blur: agentState.handler.blur,
                    keydown: handler.keydown,
                }
            }
        })

        const multipleTags = computed(() => {
            if (!model.value) {
                return []
            }
            if (!Array.isArray(model.value)) {
                console.error('The value of multiple select should be array')
                return []
            }
            if (!formatData.value || formatData.value.length === 0) return []
            return formatData.value.filter(option => model.value!.indexOf(option.val!) > -1)
        })

        const panel = {get value() {return ((agentState as any).state.agent.service.$refs.panel) as SelectPanelContextType}}

        const utils = {
            filterMethod: (option: SelectOptionCtxType) => {
                if (!!props.filterMethod) return props.filterMethod(filterText.value, option)
                return !!filterText.value && !!filterText.value.trim() ? (!!option.label && option.label.indexOf(filterText.value) > -1) : true
            }
        }

        const handler = {
            keydown: handleKeyboard({
                space: (e) => {
                    if (props.multiple && agentState.isShow.value) {
                        e.stopPropagation()
                        e.preventDefault()
                        panel.value.methods.selectHighlight()
                    }
                    emit.space(e)
                },
                enter: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (agentState.isShow.value) {
                        panel.value.methods.selectHighlight()
                    } else {
                        agentState.methods.show()
                    }
                },
                up: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel.value.methods.highlightPrev()
                    }
                },
                down: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel.value.methods.highlightNext()
                    }
                },
                esc: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        agentState.methods.hide()
                    }
                },
            }),
            onClickItemCloseIcon: (item: SelectOptionCtxType, index: number) => {
                index = model.value!.indexOf(item.val!)
                if (index > -1) {
                    const value = [...model.value!]
                    value.splice(index, 1)
                    model.value = [...value]
                }
            }
        }

        return () => (
            <pl-input {...inputBinding.value}>
                <template slot="hidden">
                    {slots.default()}
                </template>
                {!!props.multiple && (
                    <pl-input-inner-tags
                        data={multipleTags.value}
                        collapseTags={props.collapseTags}
                        {
                            ...{
                                scopedSlots: {
                                    default: ({item, index}: { item: SelectOptionCtxType, index: number }) => [
                                        <span>{item.label}</span>,
                                        <pl-icon icon="el-icon-close" onClick={() => handler.onClickItemCloseIcon(item, index)}/>
                                    ]
                                }
                            }
                        }
                    />
                )}
            </pl-input>
        )
    },
})