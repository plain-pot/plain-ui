import {StyleStatus} from "../../use/useStyle";
import {RequireFormat, VNodeChild} from "../../shims";
import Dialog from '../dialog'
import {registryRootService} from "../root/registryRootService";
import {createDefaultManager} from "../root/createDefaultManager";
import Service from './dialog-service'
import {App} from 'vue';
import {DialogService} from "../../index";
import {installPlugin} from "../../utils/installPlugin";
import {defer} from "../../utils/defer";
import {getServiceWithoutContext} from "../../utils/getServiceWithoutContext";

export enum DialogServiceEditType {
    input = 'input',
    textarea = 'textarea'
}

export interface DialogServiceOption {
    title?: string,                                                 // 标题
    message?: string,                                               // 提示的消息
    editType?: DialogServiceEditType,                               // 输入类型
    editValue?: string | number,                                    // 输入初始内容
    editReadonly?: boolean,                                         // 输入框只读
    status?: StyleStatus | null,                                    // 对话框状态
    render?: () => VNodeChild,                                      // 自定义对话框内容
    renderHead?: () => VNodeChild,                                  // 自定义对话框标题内容
    renderFoot?: () => VNodeChild,                                  // 自定义对话框底部内容
    confirmButton?: boolean,                                        // 是否显示确认按钮
    confirmButtonText?: string,                                     // 确认按钮文本
    onConfirm?: (editValue?: string) => void | Promise<void>,       // 确认按钮处理函数
    cancelButton?: boolean,                                         // 是否显示删除按钮
    cancelButtonText?: string,                                      // 删除按钮文本
    onCancel?: () => void | Promise<void>,                          // 删除按钮文本
    dialogProps?: Partial<typeof Dialog.use.props>,                 // 对话框属性
}

export type DialogServiceFormatOption = RequireFormat<DialogServiceOption, 'status'> & {
    close: () => void
}

type DialogServiceFunction = (message: string | DialogServiceOption, option?: DialogServiceOption) => void
type DialogService = { [k in StyleStatus]: DialogServiceFunction } & { confirm: DialogServiceFunction }

function formatOption(o: DialogServiceOption): DialogServiceFormatOption {
    return Object.assign(o, {
        status: o.status === null ? null : (o.status || 'primary'),
    }) as DialogServiceFormatOption
}

const getDialogService = registryRootService(
    'dialog',
    createDefaultManager('pl-dialog-manager', Service),
    (getManager) => {
        const service = (message: string | DialogServiceOption, option?: DialogServiceOption) => {
            const o: DialogServiceOption = typeof message === "string" ? {message} : message
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o)
            getManager().then(manager => manager.service(fo))
            return fo
        }

        return {
            ...Object.assign(service, Object.keys(StyleStatus).reduce((prev: any, status: any) => {
                prev[status] = function (message: string | DialogServiceOption, option?: DialogServiceOption) {
                    const o = typeof message === "object" ? message : {message}
                    if (!!option) {
                        Object.assign(o, option)
                    }
                    o.status = status
                    return service(o)
                }
                return prev
            }, {})),
            confirm: (message, option) => {
                const dfd = defer()
                const o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                o.status = o.status || StyleStatus.info
                o.confirmButton = true
                o.cancelButton = true
                const {onConfirm} = o
                o.onConfirm = () => {
                    dfd.resolve();
                    onConfirm && onConfirm()
                }
                service(o)
                return dfd.promise
            }
        } as DialogService
    }
)

export const $$dialog = getServiceWithoutContext(getDialogService)

export default {
    install(app: App) {
        installPlugin(app, Dialog)
        app.mixin({
            beforeCreate() {
                Object.defineProperty(this, '$dialog', {
                    get() {
                        return getDialogService(this)
                    },
                })
            },
        })
    },
}