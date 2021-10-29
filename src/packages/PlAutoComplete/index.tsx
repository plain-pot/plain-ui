import {computed, designComponent, PropType, reactive, useModel, useRefs, VueNode} from "plain-ui-composition";
import PlInput from "../PlInput";
import {useEditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import {useSelect} from "../PlSelect/useSelect";
import {PlSelectPanel} from "../PlSelect/PlSelectPanel";
import PlPopper from "../PlPopper";
import {handleKeyboard} from "../keyboard";
import PlSelectOption from "../PlSelectOption";

export const PlAutoComplete = designComponent({
    name: 'pl-auto-complete',
    props: {
        modelValue: {type: [String, Number]},                                           // 双向绑定值
        suggestion: {type: Array as PropType<string[]>},                                // 建议的输入文本
        filterMethod: Function,                                                         // 自定义的筛选过滤函数
        popperAttrs: {type: Object as PropType<Partial<typeof PlPopper.use.props>>},    // popper组件属性
        inputProps: {type: Object as PropType<Partial<typeof PlInput.use.props>>},      // input组件绑定属性对象
        empty: {type: Function as PropType<(defaultRender: () => VueNode) => VueNode>},// 自定义empty内容
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
        onInputChange: (val: string | null) => true,
        onClick: (val: string | number) => true,
        onBlur: (e: FocusEvent) => true,
        onFocus: (e: FocusEvent) => true,
    },
    slots: ['default'],
    setup({props, event, slots}) {

        const {emit} = event

        const {refs, onRef} = useRefs({input: PlInput})

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        /*对 pl-select-panel 的引用*/
        let panel = null as typeof PlSelectPanel.use.class | null

        /**
         * popper应该的高度
         * @author  韦胜健
         * @date    2020/12/4 10:06
         */
        const popperHeight = computed(() => props.popperAttrs?.height !== undefined ? props.popperAttrs?.height : (!props.suggestion?.length || props.suggestion?.length > 6 ? 200 : null))

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            filterMethod: (option: { label?: string, val: string, disabled: boolean }) => {
                if (!!props.filterMethod) return props.filterMethod(model.value, option)
                return !!model.value && !!String(model.value).trim() ? (!!option.label && option.label.indexOf(String(model.value == null ? '' : model.value)) > -1) : true
            }
        }

        const panelContentRender = (() => {
            const newRender = () => () => slots.default(props.suggestion?.map((suggestMsg, index) => (
                <PlSelectOption label={suggestMsg} val={suggestMsg} key={index}/>
            )))
            const state = reactive({
                render: newRender(),
                reset: () => (state.render = newRender())
            })
            return state
        })();

        /**
         * 给input组件传递的属性
         * @author  韦胜健
         * @date    2020/12/4 11:21
         */
        const inputProps = computed(() => Object.assign({}, props.inputProps || {}))

        const agentState = useEditPopperAgent({
            event,
            serviceGetter: useSelect,
            option: {
                reference: () => refs.input?.refs.input,
                renderAttrs: () => ({
                    ref: r => panel = r,
                    empty: props.empty,
                    height: popperHeight.value,
                    content: panelContentRender.render,
                    filterMethod: utils.filterMethod,
                    onChange: handler.onServiceChange,
                    onClick: event.emit.onClick,
                }),
                popperAttrs: () => ({
                    ...props.popperAttrs as any,
                    onMousedownPopper: () => agentState.state.focusCounter++,
                    onClickPopper: () => refs.input!.methods.focus(),
                    // onHide: () => model.value = null,
                }),
            },
        })

        const handler = {
            onInputKeydown: handleKeyboard({
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
            onServiceChange: (val: any) => model.value = val,
            onInputClear: () => model.value = undefined,
            onInputChange: (val: string | null) => {
                model.value = val!
                event.emit.onInputChange(val)
                if (!agentState.isShow.value) {
                    agentState.methods.show()
                }
            },
        }

        /**
         * 给input组件绑定的目标对象
         * @author  韦胜健
         * @date    2020/12/4 11:21
         */
        const inputBinding = computed(() => {
            /*onEnter不要了，只要剩余的时间监听器*/
            const {onEnter, ...inputHandler} = agentState.inputHandler
            return {
                ref: onRef.input,
                class: ([
                    'pl-autocomplete',
                ]),
                modelValue: model.value,
                suffixIcon: 'el-icon-arrow-down',
                clearIcon: true,
                isFocus: agentState.state.focusCounter > 0,
                clearHandler: handler.onInputClear,

                ...inputHandler,
                onChange: handler.onInputChange,
                onKeydown: handler.onInputKeydown,

                ...inputProps.value,
            }
        })

        return {
            render: () => {
                panelContentRender.reset()
                return <PlInput{...inputBinding.value}/>
            }
        }
    },
})

export default PlAutoComplete
