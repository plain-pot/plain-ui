import {computed, defineComponent, reactive} from "@vue/composition-api";
import {CompRef, useRefs} from "@/use/useRefs";
import {useRefer} from "@/use/useRefer";

import {$plain} from "@/packages/base";
import {VNode} from "vue/types/umd";

interface DialogServiceOption {
    message?: string,                                               // 提示的消息
    editType?: 'input' | 'textarea',                                // 输入类型
    editValue?: string,                                             // 输入初始内容
    editReadonly?: boolean,                                         // 输入框是否只读
    status?: 'primary' | 'success' | 'warn' | 'error' | 'info',     // 状态
    render?: () => VNode | VNode[] | undefined | string | number | null // 自定义内容
    onConfirm?: () => void,                                         // 确认按钮处理函数
    onCancel?: () => void,                                          // 取消按钮处理函数
}

const optionKeys = [
    'message',
    'editType',
    'editValue',
    'editReadonly',
    'status',
    'render',
    'onConfirm',
    'onCancel',
]

export default defineComponent({
    name: 'pl-dialog-service-item',
    setup(props, context) {

        const refs = useRefs({
            input: CompRef,
        })

        const state = reactive({
            show: false,
            key: 0,
            message: null as null | string | object,
            option: null as null | object,
            editValue: null as null | string,
        })

        const targetOption = computed(() => {
            let option = {} as any
            let binding = {} as any

            if (!state.message) {
                return {
                    option,
                    binding,
                }
            }

            if (typeof state.message === 'object') {
                Object.keys(state.message).forEach((key) => {
                    if (optionKeys.indexOf(key) > -1) {
                        option[key] = state.message![key]
                    } else {
                        binding[key] = state.message![key]
                    }
                })
            } else {
                option.message = String(state.message)
                if (!!state.option) {
                    Object.keys(state.option).forEach((key) => {
                        if (optionKeys.indexOf(key) > -1) {
                            option[key] = state.option![key]
                        } else {
                            binding[key] = state.option![key]
                        }
                    })
                }
            }

            // console.log({option,binding})

            return {
                option,
                binding,
            }
        })

        const handler = {
            confirm: () => {
                if (!!targetOption.value.option.onConfirm) {
                    targetOption.value.option.onConfirm(!targetOption.value.option.editType ? undefined : state.editValue)
                }
            },
            cancel: () => {
                if (!!targetOption.value.option.onCancel) {
                    targetOption.value.option.onCancel()
                }
            }
        }

        const methods = {
            open: (message, option) => {
                state.message = message
                state.option = option

                state.key++
                state.show = true

                $plain.nextTick(async () => {
                    await $plain.utils.delay(0)
                    if (!!targetOption.value.option.editType) {
                        state.editValue = targetOption.value.option.editValue
                        refs.input.methods.focus()
                    }
                })

                return () => methods.close()
            },
            close() {
                state.show = false
            },
        }

        useRefer({
            methods,
            targetOption,
            state,
        })

        return () => {

            let content = null as any
            let {option, binding} = targetOption.value

            let serviceClass = 'pl-dialog-service';
            let status = option.status === null ? null : (option.status || 'primary')

            if (!!option.editType) {
                binding = {...binding}
                if (option.editType === 'input') {
                    binding.height = binding.height || '50px'
                } else {
                    binding.height = binding.height || '500px'
                }
                serviceClass += ` pl-dialog-service-edit`

                content = <pl-input ref="input"
                                    minHeight={null}
                                    maxHeight={null}
                                    autoHeight={false}
                                    block
                                    value={option.editValue}
                                    onInput={val => state.editValue = val}
                                    readonly={option.editReadonly}
                                    textarea={option.editType === 'textarea'}/>
            } else if (!!option.message) {
                if (!!status) {
                    serviceClass += ` pl-dialog-service-status-${status}`
                }
                content = <div class="pl-dialog-service-item-message">{!!status && $plain.STATUS[status] && <pl-icon icon={$plain.STATUS[status].icon}/>}{option.message}</div>
            } else if (!!option.render) {
                content = option.render(context.parent!.$createElement)
            }


            return (
                <pl-dialog class="pl-dialog-service-item"
                           serviceClass={serviceClass}
                           value={state.show}
                           onInput={val => state.show = val}
                           key={state.key}

                           onConfirm={handler.confirm}
                           onCancel={handler.cancel}

                           {...{props: binding}}>{content}</pl-dialog>
            )
        }
    },
})