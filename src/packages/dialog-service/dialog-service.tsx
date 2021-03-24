import {computed, reactive, ref} from 'vue';
import {useRefs} from "../../use/useRefs";
import {DialogServiceFormatOption} from "./index";
import Input from '../input'
import Dialog from '../dialog'
import Icon from '../icon'
import {STATUS} from "../../utils/constant";
import {delay} from "plain-utils/utils/delay";
import './dialog-service.scss'
import {VNodeChild} from "../../shims";
import {createDefaultService} from "../root/createDefaultService";

/**
 * 用来区分 DialogServiceOption中的选项与pl-dialog组件的属性
 * @author  韦胜健
 * @date    2020/11/7 20:04
 */
const OptionKeys = [
    'title',
    'message',
    'editType',
    'editValue',
    'editReadonly',
    'status',
    'render',
    'onConfirm',
    'onCancel',
    'close',
]

export default createDefaultService({
    name: 'pl-dialog-service',
    setup(option: DialogServiceFormatOption) {
        const {refs} = useRefs({
            input: Input,
        })

        const isShow = ref(false)

        const state = reactive({
            key: 0,
            option,
            editValue: null as null | string,
        })

        const targetOption = computed(() => {
            let option = {} as DialogServiceFormatOption
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

        async function service(option: DialogServiceFormatOption) {
            option.close = hide
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
                service,
                hide,
                isShow,
                isOpen: isShow,
            },
            render: () => {
                let {option, binding} = targetOption.value
                let status = option.status
                let serviceClass = 'pl-dialog-service';

                if (!!status) {
                    serviceClass += ` pl-dialog-service-status-${status}`
                }

                /*---------------------------------------head-------------------------------------------*/
                let head = <div class="pl-dialog-service-head">
                    {!!status && STATUS[status] && <Icon class="pl-dialog-service-status-icon" icon={STATUS[status].icon}/>}
                    {!!option.renderHead ? option.renderHead() : (option.title || '提示')}
                </div>
                /*---------------------------------------content-------------------------------------------*/
                let content: VNodeChild;
                if (!!option.editType) {
                    binding = {...binding}
                    if (option.editType !== 'input') {
                        (binding as any).height = binding.height || '300px';
                        (binding as any).width = binding.width || '400px';
                    } else {
                        (binding as any).minHeight = null
                    }
                    serviceClass += ` pl-dialog-service-edit`
                    content = <Input ref="input"
                                     block
                                     minHeight={null as any}
                                     maxHeight={null as any}
                                     autoHeight={false}
                                     v-model={state.editValue}
                                     readonly={option.editReadonly}
                                     textarea={option.editType === 'textarea'}/>
                } else if (!!option.message) {
                    content = (
                        <div class="pl-dialog-service-item-message">
                            {option.message}
                        </div>
                    )
                } else if (!!option.render) {
                    content = option.render()
                }
                /*---------------------------------------foot-------------------------------------------*/
                let foot = !option.renderFoot ? null : option.renderFoot()

                return (
                    <Dialog
                        serviceClass={serviceClass}
                        v-model={isShow.value}
                        key={state.key}

                        onConfirm={handler.confirm}
                        onCancel={handler.cancel}

                        {...binding}
                        v-slots={{
                            default: !!content ? () => content : null,
                            head: !!head ? () => head : null,
                            foot: !!foot ? () => foot : null,
                        }}
                    />
                )
            }
        }
    },
})
