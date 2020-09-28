import {computed, defineComponent, reactive, watch} from "@vue/composition-api";
import {CascadeProps} from "@/packages/cascade/cascade-constant";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {$plain} from "@/packages/base";

import {CompRef, useRefs} from "@/use/useRefs";
import {useScopedSlots} from "@/use/useScopedSlots";
import {CascadeNode} from "@/packages/cascade/CascadeNode";
import {CascadeMark} from "@/packages/cascade/CascadeMark";
import {handleKeyboard} from "@/packages/keyboard";
import {useEditPopperAgent} from "@/packages/popper/agent/useEditPopperAgent";
import {$cascade} from "@/packages/cascade/CascadeService";

export default defineComponent({
    name: 'pl-cascade',
    props: {
        ...CascadeProps,
        ...StyleProps,
        ...EditProps,
    },
    setup(props) {

        useStyle()
        useEdit()

        const refs = useRefs({
            input: CompRef
        })
        const {$scopedSlots} = useScopedSlots({
            default: {node: CascadeNode, index: Number}
        })

        const {emit} = useEvent({
            input: (expandKeys: string[] | null | undefined, nodes?: CascadeNode[]) => undefined,
            blur: EmitFunc,
            focus: EmitFunc,
            clickItem: EmitFunc,
            getChildren: EmitFunc,
            updateData: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.value, emit.input, false)
        const data = useModel(() => props.data, emit.updateData)

        const cascadeMark = computed(() => new CascadeMark(
            () => ({
                nodeDisabled: props.nodeDisabled as any,
                isLeaf: props.isLeaf as any,
                lazy: props.lazy as any,
                getChildren: props.getChildren as any,
                filterMethod: props.filterMethod as any,

                labelField: props.labelField as any,
                keyField: props.keyField as any,
                childrenField: props.childrenField as any,
            }),
            () => ({
                expandKeys: state.expandKeys,
                filterText: '',
            })
        ))

        const state = reactive({
            inputValue: null as null | string,
            cacheData: {} as { [key: string]: object[] },
            expandKeys: [] as string[],
        })

        const agentState = useEditPopperAgent(() => $cascade(() => ({
            reference: () => refs.$el,
            props: {
                ...props,
                value: model.value,
                filterText: state.inputValue,
                getChildren: utils.getChildren,
                renderContent: (!!$scopedSlots.default || !!props.renderContent) ? (h, {node, index}) => {
                    if (!!$scopedSlots.default) return $scopedSlots.default({node, index})
                    if (!!props.renderContent) return props.renderContent(h, {node, index})
                } : null,
            } as ExtractPropTypes<typeof CascadeProps>,
            listener: {
                emit: ({event, args}) => {
                    if (event === 'change') {
                        model.value = args[0]
                    }
                    if (!!emit[event]) {
                        emit[event](...args)
                    }
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
                    state.inputValue = null
                },
            }
        })))

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
                let flag: boolean = false
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
        }

        const handler = {
            keydown: handleKeyboard({
                esc: agentState.handler.esc,
                enter: agentState.handler.enter,
            }),
            clear: () => {
                model.value = undefined
                emit.input(model.value)

                state.inputValue = null
                refs.input.methods.focus()
            },
            inputChange: (val) => {
                state.inputValue = val
                if (!agentState.isShow.value && !$plain.utils.ie) {
                    agentState.methods.show()
                }
            },
        }

        watch(() => props.value, () => {
            state.inputValue = null
        })

        return () => (
            <pl-input
                ref="input"
                class={classes.value}
                clearIcon
                suffixIcon="el-icon-d-arrow-right"
                value={(agentState.isShow.value && props.filterable) ? state.inputValue : showValue.value}
                placeValue={showValue.value}
                placeholder={((agentState.isShow.value && props.filterable) ? showValue.value : (!!props.inputProps ? props.inputProps!.placeholder : null)) || ''}
                clearHandler={handler.clear}
                inputReadonly={!props.filterable}
                isFocus={agentState.state.focusCounter > 0}
                {
                    ...{
                        on: {
                            change: handler.inputChange,
                            'click-input': agentState.handler.clickInput,
                            blur: agentState.handler.blur,
                            focus: agentState.handler.focus,
                            keydown: handler.keydown
                        },
                    }
                }
            />
        )
    },
})