import {designComponent} from "../../use/designComponent";
import './select.scss'
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import Input from '../input'
import {SelectOption} from "./select-option";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {SelectServiceGetter} from "./select-service";
import {ref, computed} from 'vue';
import {useCollect} from "../../use/useCollect";
import Option from './select-option'
import {ie} from "plain-utils/utils/ie";
import {handleKeyboard} from "../keyboard";
import Panel from './select-panel'
import {useModel} from "../../use/useModel";

const Props = {
    ...EditProps,
    ...StyleProps,

    modelValue: {type: [String, Array]},
    filterable: {type: Boolean, default: true},                     // 是否可以输入筛选
    inputProps: {type: Object},                                     // input组件绑定属性对象

    multiple: {type: Boolean},                                      // 是否多选
    multipleMaxLimit: {type: Number},                               // 多选最多选择个数
    multipleMinLimit: {type: Number},                               // 多选最少选择个数
    collapseTags: {type: Boolean, default: true},                   // 多选模式下，超过三个选项，其他的将省略显示

    noMatchText: {type: String, default: '暂无匹配数据'},            // 筛选无数据时展示的文本
    noDataText: {type: String, default: '暂无数据'},                // 无数据时显示的文本
    filterMethod: Function,                                         // 筛选过滤函数
}

const Select = designComponent({
    name: 'pl-select',
    props: {
        ...Props,
    },
    emits: {
        updateModelValue: (val?: string | string[]) => true,
        click: (option: SelectOption) => true,

        space: (e: KeyboardEvent) => true,
        enter: (e: KeyboardEvent) => true,
        up: (e: KeyboardEvent) => true,
        down: (e: KeyboardEvent) => true,
        esc: (e: KeyboardEvent) => true,

        blur: (e: Event) => true,
        focus: (e: Event) => true,
    },
    setup({props, event}) {

        useStyle()
        const {slots} = useSlots()
        const {refs} = useRefs({
            input: Input,
        })

        let panel = null as typeof Panel.use.class | null

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.modelValue as string | string[] | undefined, event.emit.updateModelValue)
        const filterText = ref(null as string | null)
        const agentState = useEditPopperAgent({
            event,
            serviceGetter: SelectServiceGetter,
            option: {
                reference: () => refs.input as any,
                renderAttrs: () => ({
                    ref: r => panel = r,
                    ...(Object.keys(Props).reduce((ret: any, key) => {
                        ret[key] = (props as any)[key]
                        return ret
                    }, {})),
                    modelValue: model.value,
                    height: popperHeight.value,
                    content: () => slots.default(),
                    filterMethod: utils.filterMethod,
                    onChange: (val) => model.value = val,
                    onClick: (option: SelectOption) => event.emit.click(option)
                }),
                popperAttrs: () => ({
                    onMousedownPopper: () => agentState.state.focusCounter++,
                    onClickPopper: () => refs.input!.methods.focus(),
                    onHide: () => filterText.value = null,
                }),
            },
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            filterMethod: (option: { label?: string, val: string, disabled: boolean }) => {
                if (!!props.filterMethod) return props.filterMethod(filterText.value, option)
                return !!filterText.value && !!filterText.value.trim() ? (!!option.label && option.label.indexOf(filterText.value) > -1) : true
            }
        }

        /*---------------------------------------computed-------------------------------------------*/

        /**
         * 收集的option实例
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const items = SelectCollector.parent()
        /**
         * 有效的 pl-select-option
         * @author  韦胜健
         * @date    2020/12/4 10:06
         */
        const formatData = computed(() => items.filter(i => !i.props.group))
        /**
         * popper应该的高度
         * @author  韦胜健
         * @date    2020/12/4 10:06
         */
        const popperHeight = computed(() => formatData.value.length > 6 ? 256 : null)
        /**
         * 显示值
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const displayValue = computed(() => {
            if (!props.multiple) {
                for (let i = 0; i < formatData.value.length; i++) {
                    const item = formatData.value[i];
                    if (item.props.val === model.value) {
                        return item.props.label
                    }
                }
                return model.value
            } else {
                let strings: string[] = []
                if (!!model.value && Array.isArray(model.value)) {
                    for (let i = 0; i < formatData.value.length; i++) {
                        const item = formatData.value[i];
                        if (model.value.indexOf(item.props.val!) > -1) {
                            strings.push(item.props.label!)
                        }
                    }
                }
                return strings.join('').trim()
            }
        })

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

                ...inputProps.value,

                modelValue: (props.filterable && agentState.isShow.value) ? filterText.value : displayValue.value,
                placeValue: displayValue.value,
                inputReadonly: !props.filterable,
                placeholder: placeholderValue.value,
                suffixIcon: 'el-icon-arrow-down',
                clearIcon: true,
                isFocus: agentState.state.focusCounter > 0,
                clearHandler: () => model.value = undefined,

                ...agentState.inputHandler,
                onChange: (val: string | null) => {
                    filterText.value = val
                    if (!agentState.isShow.value && ie) {
                        agentState.methods.show()
                    }
                },
                onKeydown: handler.keydown,
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
            return formatData.value.filter(option => model.value!.indexOf(option.props.val!) > -1)
        })

        const handler = {
            keydown: handleKeyboard({
                space: (e) => {
                    if (props.multiple && agentState.isShow.value) {
                        e.stopPropagation()
                        e.preventDefault()
                        panel!.methods.selectHighlight()
                    }
                    event.emit.space(e)
                },
                enter: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (agentState.isShow.value) {
                        panel!.methods.selectHighlight()
                    } else {
                        agentState.methods.show()
                    }
                },
                up: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel!.methods.highlightPrev()
                    }
                },
                down: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel!.methods.highlightNext()
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
            onClickItemCloseIcon: (item: SelectOption, index: number) => {
                index = model.value!.indexOf(item.props.val!)
                if (index > -1) {
                    const value = [...model.value!]
                    value.splice(index, 1)
                    model.value = [...value]
                }
            }
        }

        return {
            render: () => (
                <pl-input {...inputBinding.value} v-slots={{
                    hidden: slots.default,
                    default: !props.multiple ? null : () => (
                        <pl-input-inner-tags
                            data={multipleTags.value}
                            collapseTags={props.collapseTags}
                            {
                                ...{
                                    scopedSlots: {
                                        default: ({item, index}: { item: SelectOption, index: number }) => [
                                            <span>{item.props.label}</span>,
                                            <pl-icon icon="el-icon-close" onClick={() => handler.onClickItemCloseIcon(item, index)}/>
                                        ]
                                    }
                                }
                            }
                        />
                    )
                }}/>
            )
        }
    },
})

export default Select

export const SelectCollector = useCollect(() => ({
    parent: Select,
    child: Option,
}))