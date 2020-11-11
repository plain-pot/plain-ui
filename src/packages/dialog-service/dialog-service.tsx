import {designComponent} from "../../use/designComponent";
import {computed, reactive, ref} from 'vue';
import {useRefs} from "../../use/useRefs";
import {DialogServiceOption} from "./index";
import Input from '../input'
import Dialog from '../dialog'
import {STATUS} from "../../utils/constant";
import {delay} from "plain-utils/utils/delay";
import './dialog-service.scss'

/**
 * 用来区分 DialogServiceOption中的选项与pl-dialog组件的属性
 * @author  韦胜健
 * @date    2020/11/7 20:04
 */
const OptionKeys = [
    'message',
    'editType',
    'editValue',
    'editReadonly',
    'status',
    'render',
    'onConfirm',
    'onCancel',
]

export default designComponent({
    name: 'pl-dialog-service',
    props: {
        option: {type: Object, required: true,}
    },
    setup({props}) {

        const {refs} = useRefs({
            input: Input,
        })

        const isShow = ref(false)

        const state = reactive({
            key: 0,
            option: props.option as DialogServiceOption,
            editValue: null as null | string,
        })

        const targetOption = computed(() => {
            let option = {} as DialogServiceOption
            let binding = {} as Partial<typeof Dialog.use.props>

            Object.keys(state.option).forEach((key) => {
                if (OptionKeys.indexOf(key) > -1) {
                    (option as any)[key] = (state.option as any)[key]
                } else {
                    (binding as any)[key] = (state.option as any)[key]
                }
            })

            return {
                option,
                binding,
            }
        })

        const handler = {
            confirm: () => {
                if (!!targetOption.value.option.onConfirm) {
                    targetOption.value.option.onConfirm(!targetOption.value.option.editType ? undefined : state.editValue as string)
                }
            },
            cancel: () => {
                if (!!targetOption.value.option.onCancel) {
                    targetOption.value.option.onCancel()
                }
            },
        }

        async function show(option: DialogServiceOption) {
            state.option = option
            state.key++
            isShow.value = true
            if (!!option.editType) {
                state.editValue = option.editValue as string
                await delay(300)
                refs.input!.methods.focus()
            }
            return hide
        }

        function hide() {
            isShow.value = false
        }

        return {
            refer: {
                show,
                hide,
                isShow,
                isOpen: isShow,
            },
            render: () => {
                let content = null as any
                let {option, binding} = targetOption.value

                let serviceClass = 'pl-dialog-service';
                let status = option.status === null ? null : (option.status || 'primary')

                if (!!option.editType) {
                    binding = {...binding}
                    if (option.editType !== 'input') {
                        (binding as any).height = binding.height || '500px'
                    } else {
                        (binding as any).minHeight = null
                    }
                    serviceClass += ` pl-dialog-service-edit`

                    content = <pl-input ref="input"
                                        block
                                        minHeight={null}
                                        maxHeight={null}
                                        autoHeight={false}
                                        v-model={state.editValue}
                                        readonly={option.editReadonly}
                                        textarea={option.editType === 'textarea'}/>
                } else if (!!option.message) {
                    if (!!status) {
                        serviceClass += ` pl-dialog-service-status-${status}`
                    }
                    content = (
                        <div class="pl-dialog-service-item-message">
                            {!!status && STATUS[status] && <pl-icon class="pl-dialog-service-status-icon" icon={STATUS[status].icon}/>}
                            {option.message}
                        </div>
                    )
                } else if (!!option.render) {
                    content = option.render()
                }

                return (
                    <pl-dialog
                        serviceClass={serviceClass}
                        v-model={isShow.value}
                        key={state.key}

                        onConfirm={handler.confirm}
                        onCancel={handler.cancel}

                        {...binding}>
                        {content}
                    </pl-dialog>
                )
            }
        }
    },
})