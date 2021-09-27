import {computed, useRefs, reactive, ref, VueNode} from "plain-ui-composition";
import {createDefaultService} from "../PlRoot/createDefaultService";
import {DialogServiceEditType, DialogServiceFormatOption} from "./index";
import {PlInput} from "../PlInput";
import {PlDialog} from "../PlDialog";
import {delay} from "plain-utils/utils/delay";
import {STATUS} from "../../utils/constant";
import PlIcon from "../PlIcon";
import PlNumber from "../PlNumber";
import $$message from "../$$message";
import {deepcopy} from "plain-utils/object/deepcopy";

/**
 * 用来区分 DialogServiceOption中的选项与pl-dialog组件的属性
 * @author  韦胜健
 * @date    2020/11/7 20:04
 */
const OptionKeys = [
    'title',
    'message',
    'editRequired',
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
        const {refs, onRef} = useRefs({
            input: PlInput,
            number: PlNumber,
        })

        const isShow = ref(false)

        const state = reactive({
            key: 0,
            option,
            editValue: null as any,
        })

        const targetOption = computed(() => {
            let option = {} as DialogServiceFormatOption
            let dialogProps = deepcopy(state.option.dialogProps || {})

            Object.keys(state.option).forEach((key) => {
                if (OptionKeys.indexOf(key) > -1) {
                    (option as any)[key] = (state.option as any)[key]
                } else {
                    (dialogProps as any)[key] = (state.option as any)[key]
                }
            })
            option.dialogProps = dialogProps

            return {
                option,
            }
        })

        const handler = {
            done: (isConfirm: boolean) => {
                const {closeOnCancel, closeOnConfirm} = targetOption.value.option!.dialogProps!
                if (isConfirm && closeOnConfirm !== false) {
                    isShow.value = false
                } else if (!isConfirm && closeOnCancel !== false) {
                    isShow.value = false
                }
            },
            confirm: () => {
                const {onConfirm, editType, editReadonly, editRequired} = targetOption.value.option
                if (!onConfirm) {
                    handler.done(true)
                    return
                }
                if (!editType || editReadonly) {
                    handler.done(true)
                    return onConfirm(state.editValue)
                }
                const {editValue} = state
                if (editType !== "number") {
                    if (editRequired && (!editValue || !editValue.trim())) {
                        return $$message.error('请输入文本！')
                    } else {
                        handler.done(true)
                        return onConfirm(editValue.trim())
                    }
                } else {
                    if (editRequired && isNaN(Number(editValue))) {
                        return $$message.error('请输入数字！')
                    } else {
                        handler.done(true)
                        return onConfirm(editValue == null ? null : Number(editValue) as any)
                    }
                }
            },
            cancel: () => {
                if (!!targetOption.value.option.onCancel) {
                    targetOption.value.option.onCancel()
                }
                handler.done(false)
            },
        }

        async function service(option: DialogServiceFormatOption) {
            option.close = hide
            state.option = option
            state.key++
            isShow.value = true
            if (!!option.editType) {
                state.editValue = option.editValue as string
                await delay(300);
                if (option.editType === 'number') {
                    refs.number!.focus()
                } else {
                    refs.input!.methods.focus()
                }
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
                let {option} = targetOption.value
                let binding = option.dialogProps
                let status = option.status
                let serviceClass = 'pl-dialog-service';

                if (!!status) {
                    serviceClass += ` pl-dialog-service-status-${status}`
                }

                /*---------------------------------------head-------------------------------------------*/
                let head = <div class="pl-dialog-service-head">
                    {!!status && STATUS[status] && <PlIcon class="pl-dialog-service-status-icon" icon={STATUS[status].icon}/>}
                    {!!option.renderHead ? option.renderHead() : (option.title || '提示')}
                </div>
                /*---------------------------------------content-------------------------------------------*/
                let content: VueNode;
                binding = {...binding}
                delete (binding as any).dialogProps
                if (!!option.editType) {
                    if (option.editType === 'textarea') {
                        (binding as any).height = binding.height || '300px';
                        (binding as any).width = binding.width || '400px';
                    } else {
                        (binding as any).minHeight = null
                    }
                    serviceClass += ` pl-dialog-service-edit`
                    content = option.editType === 'number' ? (
                        <PlNumber
                            ref={onRef.number}
                            block
                            minHeight={null as any}
                            maxHeight={null as any}
                            v-model={state.editValue}
                            readonly={option.editReadonly}
                        />
                    ) : <PlInput
                        ref={onRef.input}
                        block
                        minHeight={null as any}
                        maxHeight={null as any}
                        autoHeight={false}
                        v-model={state.editValue}
                        readonly={option.editReadonly}
                        textarea={option.editType === 'textarea'}/>
                } else if (!!option.message) {
                    (binding as any).minHeight = '80px'
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

                const width = (() => {
                    if (!!option.dialogProps && option.dialogProps.width !== undefined) {return option.dialogProps.width}
                    if (option.editType === DialogServiceEditType.textarea) {
                        return ((option.dialogProps || {}).width || '500px')
                    } else {
                        return 500
                    }
                })()

                return (
                    <PlDialog
                        serviceClass={serviceClass}
                        v-model={isShow.value}
                        key={state.key}

                        onConfirm={handler.confirm}
                        onCancel={handler.cancel}
                        closeOnConfirm={false}
                        closeOnCancel={false}

                        {...binding}
                        width={width}
                        shape={binding.shape}
                        v-slots={(() => {
                            const ret = {} as any
                            !!content && (ret.default = () => content);
                            !!head && (ret.head = () => head);
                            !!foot && (ret.foot = () => foot);
                            return ret
                        })()}
                    />
                )
            }
        }
    },
})
