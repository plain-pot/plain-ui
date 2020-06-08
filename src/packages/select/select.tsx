import {computed, defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR, SelectUtils} from "@/packages/select/select-utils";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {$plain} from "@/packages/base";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {CompRef, useRefs} from "@/use/useRefs";

const Props = {
    value: {type: [String, Array]},

    multiple: {type: Boolean},                                      // 是否多选
    multipleMaxLimit: {type: Number},                               // 多选最多选择个数
    multipleMinLimit: {type: Number},                               // 多选最少选择个数

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

        const {slots} = useSlots()
        const refs = useRefs({
            input: CompRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            click: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)

        const agentState = usePopperAgentEditor(() => ($plain as any).$select(() => ({
            props: {
                ...(Object.keys(Props).reduce((ret, key) => {
                    ret[key] = props[key]
                    return ret
                }, {})),

                value: model.value,
                content: () => slots.default()
            },
            popperProps: {
                reference: refs.$el,
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
                    // state.inputValue = null
                },
            }
        })))

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
        const formatData = computed(() => SelectUtils.formatItems(items.value))

        /**
         * 显示值
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const displayValue = computed(() => {
            for (let i = 0; i < formatData.value.length; i++) {
                const item = formatData.value[i];
                if (item.val === props.value) {
                    return item.label
                }
            }
            return null
        })

        const inputBinding = computed(() => {
            return {
                ref: 'input',
                class: [
                    'pl-select'
                ],
                props: {
                    value: displayValue.value,
                    suffixIcon: 'el-icon-date',
                    clearIcon: true,
                    isFocus: agentState.state.focusCounter > 0,
                    clearHandler: () => model.value = undefined,
                },
                on: {
                    'click-input': e => {
                        agentState.handler.clickInput()
                    },
                    focus: agentState.handler.focus,
                    blur: agentState.handler.blur,
                }
            }
        })

        return () => (
            <pl-input {...inputBinding.value}>
                <template slot="hidden">
                    {slots.default()}
                </template>
            </pl-input>
        )
    },
})