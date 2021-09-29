import {StyleStatus} from "../../use/useStyle";
import {PlDialog} from "../PlDialog";
import {createServiceWithoutContext, createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";
import PlDialogService from "./PlDialogService";
import './dialog-service.scss'
import {VueNode} from "plain-ui-composition";
import {RequireFormat} from "../../utils/type";
import {defer} from "plain-utils/utils/defer";

export enum DialogServiceEditType {
    input = 'input',
    textarea = 'textarea',
    number = 'number',
}

export interface DialogServiceOption {
    title?: string,                                                 // 标题
    message?: string,                                               // 提示的消息
    editRequired?: boolean,                                         // 输入的时候是否必填
    editType?: keyof typeof DialogServiceEditType,                  // 输入类型
    editValue?: string | number,                                    // 输入初始内容
    editReadonly?: boolean,                                         // 输入框只读
    status?: keyof typeof StyleStatus | null,                                    // 对话框状态
    render?: () => VueNode,                                       // 自定义对话框内容
    renderHead?: () => VueNode,                                   // 自定义对话框标题内容
    renderFoot?: () => VueNode,                                   // 自定义对话框底部内容
    confirmButton?: boolean,                                        // 是否显示确认按钮
    confirmButtonText?: string,                                     // 确认按钮文本
    onConfirm?: (editValue?: string) => void | Promise<void>,       // 确认按钮处理函数
    cancelButton?: boolean,                                         // 是否显示删除按钮
    cancelButtonText?: string,                                      // 删除按钮文本
    onCancel?: () => void | Promise<void>,                          // 删除按钮文本
    dialogProps?: Partial<typeof PlDialog.use.props>,               // 对话框属性
}

export type DialogServiceFormatOption = RequireFormat<DialogServiceOption, 'status'> & {
    close: () => void
}

type DialogServiceFunction = (message: string | DialogServiceOption, option?: DialogServiceOption) => DialogServiceFormatOption
type DialogService = DialogServiceFunction & { [k in StyleStatus]: DialogServiceFunction } & { confirm: DialogServiceFunction }

function formatOption(o: DialogServiceOption): DialogServiceFormatOption {
    if (!o.editType) {
        o.status = o.status === null ? null : (o.status || 'primary')
    }
    return o as DialogServiceFormatOption
}

const useDialog = createUseService({
    name: 'dialog',
    managerComponent: createDefaultManager('pl-dialog-manager', PlDialogService),
    createService: (getManager) => {
        const service = (message: string | DialogServiceOption, option?: DialogServiceOption) => {
            const o: DialogServiceOption = typeof message === "string" ? {message} : message
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o)
            getManager().then(manager => manager.service(fo))
            return fo
        }

        return Object.assign(
            service,
            Object.keys(StyleStatus).reduce((prev: any, status: any) => {
                prev[status] = function (message: string | DialogServiceOption, option?: DialogServiceOption) {
                    const o = typeof message === "object" ? message : {message}
                    if (!!option) {
                        Object.assign(o, option)
                    }
                    o.status = status
                    return service(o)
                }
                return prev
            }, {
                confirm: (message: string | DialogServiceOption, option?: DialogServiceOption) => {
                    const dfd = defer()
                    const o = typeof message === "object" ? message : {message}
                    if (!!option) {
                        Object.assign(o, option)
                    }
                    o.status = o.status == undefined ? null : o.status
                    o.confirmButton = true
                    o.cancelButton = true
                    const {onConfirm, onCancel} = o
                    o.onConfirm = () => {
                        dfd.resolve();
                        onConfirm && onConfirm()
                    }
                    o.onCancel = () => {
                        dfd.reject();
                        onCancel && onCancel()
                    }
                    service(o)
                    return dfd.promise
                }
            })
        ) as DialogService
    }
})

export const $$dialog = createServiceWithoutContext(useDialog)

export default useDialog
