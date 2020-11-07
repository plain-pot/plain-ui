import {ComponentPublicInstance} from "vue";
import {StyleStatus} from "../../use/useStyle";
import {VNodeChild} from "../../shims";
import Dialog from '../dialog'
import {RootController} from "../root/root-service";

export enum DialogServiceEditType {
    input = 'input',
    textarea = 'textarea'
}

interface DialogServiceOption {
    message?: string,                                               // 提示的消息
    editType?: DialogServiceEditType,                               // 输入类型
    editValue?: string | number,                                    // 输入初始内容
    editReadonly?: boolean,                                         // 输入框只读
    status?: StyleStatus,                                           // 对话框状态
    render?: () => VNodeChild,                                      // 自定义对话框内容
    confirmButton?: boolean,                                        // 是否显示确认按钮
    confirmButtonText?: string,                                     // 确认按钮文本
    onConfirm?: () => void | Promise<void>,                         // 确认按钮处理函数
    cancelButton?: boolean,                                         // 是否显示删除按钮
    cancelButtonText?: string,                                      // 删除按钮文本
    onCancel?: () => void | Promise<void>,                          // 删除按钮文本
    dialogProps?: Partial<typeof Dialog.use.props>,                 // 对话框属性
}

function createDialogService(ins: ComponentPublicInstance) {
    return (message: string | DialogServiceOption, option?: DialogServiceOption) => {
        const o = typeof message === "string" ? {message} : message
        if (!!option) {
            Object.assign(o, option)
        }
        const root = RootController.getRoot(ins)
        // root.getController('dialog',)
    }
}