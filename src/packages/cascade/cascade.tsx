import {designComponent} from "../../use/designComponent";
import {CascadePanelProps} from "./panel/cascade-panel";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useRefs} from "../../use/useRefs";
import Input from '../input'
import {useScopedSlots} from "../../use/useScopedSlots";
import {CascadeNode} from "./utils/CascadeNode";
import {useModel} from "../../use/useModel";
import {computed, reactive, watch} from 'vue';
import {CascadeMark} from "./utils/CascadMark";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {CascadeServiceGetter} from "./service/cascade-service";
import {ie} from "plain-utils/utils/ie";
import './cascade.scss'

export default designComponent({
    name: 'pl-cascade',
    props: {
        ...CascadePanelProps,

        showLast: {type: Boolean},                                          // 只显示最后一级节点文本
        separator: {type: String, default: ' / '},                          // 显示值分隔符
        filterable: {type: Boolean, default: true},                         // 是否可筛选
        showFormat: {                                                       // 显示值格式化函数
            type: Function as any as new() => ((value: any[]) => string)
        },

        inputAttrs: {type: Object},                                         // 输入框属性值

        ...StyleProps,
        ...EditProps,
    },
    emits: {
        updateModelValue: (val: any, expandNodes?: CascadeNode[]) => true,
        clickItem: (data: { node: CascadeNode, index: number }) => true,
        getChildren: (...args: any[]) => true,
        updateData: (val: any) => true,
        blur: (e: Event) => true,
        focus: (e: Event) => true,
    },
    setup({props, event}) {

        useStyle()
        const {refs} = useRefs({
            input: Input,
        })
        const {scopedSlots} = useScopedSlots({
            default: {node: CascadeNode, index: Number}
        }, true)

        /*之所以不自动派发事件，是因为派发事件的时候需要多传一个nodes值*/
        const model = useModel(() => props.modelValue, event.emit.updateModelValue, {autoEmit: false})
        const data = useModel(() => props.data, event.emit.updateData)

        const state = reactive({
            inputValue: null as null | string,
            cacheData: {} as { [key: string]: object[] },
            expandKeys: [] as string[],
        })

        const cascadeMark = computed(() => new CascadeMark(
            () => ({
                nodeDisabled: props.nodeDisabled,
                isLeaf: props.isLeaf,
                lazy: props.lazy,
                getChildren: props.getChildren,
                filterMethod: props.filterMethod,

                labelField: props.labelField!,
                keyField: props.keyField!,
                childrenField: props.childrenField!,
            }),
            () => ({
                expandKeys: state.expandKeys,
                filterText: '',
            })
        ))

        const agentState = useEditPopperAgent({
            event,
            serviceGetter: CascadeServiceGetter,
            option: {
                reference: () => refs.input as any,
                renderAttrs: () => ({
                    ...props,
                    modelValue: model.value,
                    filterText: state.inputValue,
                    getChildren: utils.getChildren,
                    renderContent: utils.renderContent,

                    onChange: handler.onServiceChange,
                    onClickItem: event.emit.clickItem,
                    onGetChildren: event.emit.getChildren,
                    onUpdateData: event.emit.updateData,
                }),
                popperAttrs: {
                    onMousedownPopper: () => agentState.state.focusCounter++,
                    onClickPopper: () => refs.input!.methods.focus(),
                    onHide: () => state.inputValue = null,
                },
            },
        })


        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            getChildren: (node: CascadeNode | null, resolve: Function) => {
                let key = !!node ? node.key : 'root'
                if (state.cacheData[key]) {
                    resolve(state.cacheData[key])
                } else {
                    props.getChildren!(node, (data) => {
                        state.cacheData[key] = data
                        resolve(data)
                    })
                }
            },
            /**
             * 检查props是否合法
             * @author  韦胜健
             * @date    2020/3/30 18:48
             */
            checkProps() {
                if (!props.data) return true
                if (!props.keyField) {
                    console.error('pl-cascade 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                    return false
                }
                if (!props.childrenField) {
                    console.error('pl-cascade 的 childrenKey不能为空')
                    return false
                }
                return true
            },
            renderContent: (scopedSlots.default.isExist() || !!props.renderContent) ? ({node, index}: { node: CascadeNode, index: number }) => {
                if (scopedSlots.default.isExist()) return scopedSlots.default({node, index})
                if (!!props.renderContent) return props.renderContent({node, index})
            } : null
        }


        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => ([
            'pl-cascade',
            {
                'pl-cascade-open': agentState.isShow.value,
            }
        ]))

        const formatData = computed(() => cascadeMark.value.node.getList(data.value, 1, () => null))

        const showValue = computed(() => {
            if (!model.value) return null
            if (!!props.showFormat) return props.showFormat(model.value)

            let result: string[] = []
            let list = formatData.value || []
            for (let i = 0; i < model.value.length; i++) {
                const sourceKey = model.value[i];
                let flag = false
                for (let j = 0; j < list.length; j++) {
                    const target = list[j];
                    if (sourceKey === target.key) {
                        result.push(target.label)
                        list = target.children || []
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    result = [...result, ...(model.value.slice(i)) as string[]]
                    break
                }
            }
            if (props.showLast && result.length > 0) {
                return result[result.length - 1]
            }
            return result.join(' / ')
        })


        const handler = {
            clear: () => {
                model.value = undefined
                event.emit.updateModelValue(model.value)

                state.inputValue = null
                refs.input!.methods.focus()
            },
            onServiceChange: (val: any, nodes: CascadeNode[]) => {
                model.value = val
                event.emit.updateModelValue(val, nodes)
            },
            onInputChange: (val: string) => {
                state.inputValue = val
                if (!agentState.isShow.value && !ie) {
                    agentState.methods.show()
                }
            },
        }

        watch(() => props.modelValue, () => {state.inputValue = null})

        return {
            render: () => (
                <pl-input
                    ref="input"
                    class={classes.value}
                    clearIcon
                    suffixIcon="el-icon-d-arrow-right"
                    modelValue={(agentState.isShow.value && props.filterable) ? state.inputValue : showValue.value}
                    placeValue={showValue.value}
                    placeholder={((agentState.isShow.value && props.filterable) ? showValue.value : (!!props.inputAttrs ? props.inputAttrs!.placeholder : null)) || ''}
                    clearHandler={handler.clear}
                    inputReadonly={!props.filterable}
                    isFocus={agentState.state.focusCounter > 0}

                    onChange={handler.onInputChange}
                    {...agentState.inputHandler}
                />
            )
        }
    },
})