import {designComponent, onBeforeUnmount, InheritHtmlElement, reactive, useClasses, useModel, useRefs} from 'plain-ui-composition'
import './tag-input.scss'
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {PlInput} from "../PlInput";
import {delay} from "plain-utils/utils/delay";
import {getKey, KEY} from "../keyboard";
import PlTag from "../PlTag";
import PlIcon from "../PlIcon";

export const PlTagInput = designComponent({
    name: 'pl-tag-input',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: Array},                                              // 数组，双向绑定值
        close: {type: Boolean, default: true},                                  // 是否可删除
        beforeAdd: Function,                                                    // 添加前校验
        beforeRemove: Function,                                                 // 删除前校验
        formatValue: Function,                                                  // 格式化输入值，返回一个值，或者对象
        noInput: Function,                                                      // 是否显示输入框
    },
    inheritPropsType: InheritHtmlElement,
    emits: {
        onUpdateModelValue: (val: any[] | undefined) => true
    },
    scopeSlots: {
        default: (scope: { item: string, index: number }) => {},
    },
    setup({props, scopeSlots, event: {emit}}) {

        const {refs, onRef} = useRefs({
            input: PlInput,
            el: HTMLDivElement,
        })

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const state = reactive({
            isEditing: false,
            inputValue: null as string | null,
        })
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle()

        const classes = useClasses(() => ([
            'pl-tag-input',
            `pl-tag-input-status-${styleComputed.value.status}`,
            {
                'pl-tag-input-disabled': editComputed.value.disabled,
            },
        ]))


        onBeforeUnmount(() => {
            window.removeEventListener('click', handler.clickWindow, true)
        })

        const handler = {
            clickWindow: (e: MouseEvent) => {
                if (!refs.input!.refs.input!.contains(e.target as Node)) {
                    state.isEditing = false
                    window.removeEventListener('click', handler.clickWindow, true)
                }
            },
            clickEditButton: async () => {
                if (!editComputed.value.editable) {
                    return
                }
                state.isEditing = true
                await delay(23)
                refs.input!.methods.focus()
                // 点击其他元素的时候关闭输入状态
                await delay()
                window.addEventListener('click', handler.clickWindow, true)
            },
            inputEnter: async () => {
                if (!editComputed.value.editable) {
                    return
                }

                let inputValue = state.inputValue

                if (inputValue != '0' && !inputValue) {
                    return
                }

                if (!!props.beforeAdd) {
                    await props.beforeAdd(inputValue)
                }
                if (!!props.formatValue) {
                    inputValue = await props.formatValue(inputValue)
                }

                let value = [...(model.value || [])]
                value.push(inputValue)
                model.value = value
                state.inputValue = null
            },
            tagClose: async (item: any, index: number) => {
                if (!editComputed.value.editable) {
                    return
                }
                if (!!props.beforeRemove) {
                    await props.beforeRemove(item, index)
                }
                model.value!.splice(index, 1)
                model.value = [...model.value!]
            },
            keydown: (e: KeyboardEvent) => {
                if (getKey(e) === KEY.enter) {
                    handler.inputEnter()
                }
            }
        }

        return {
            refer: {refs},
            render: () => {
                return (
                    <div class={classes.value} ref={onRef.el}>
                        {
                            (model.value || []).map((item: any, index) => (
                                scopeSlots.default({item, index}, (
                                    <PlTag key={index} label={item} close={editComputed.value.editable && props.close} onClose={() => handler.tagClose(item, index)}/>
                                ))
                            ))
                        }
                        {!props.noInput && (
                            <PlInput
                                v-model={state.inputValue}
                                ref={onRef.input}
                                key={state.isEditing ? 1 : 2}
                                onKeydown={handler.keydown}
                                v-slots={{
                                    ...state.isEditing ? {} : {
                                        default: () => (
                                            <div class="pl-tag-input-not-edit"
                                                 onClick={handler.clickEditButton}>
                                                <PlIcon icon="el-icon-plus"/>
                                                <span>添加</span>
                                            </div>
                                        )
                                    }
                                }}
                            />
                        )}
                    </div>
                )
            }
        }
    },
})

export default PlTagInput
