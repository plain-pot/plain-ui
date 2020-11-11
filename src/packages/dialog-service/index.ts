import {StyleStatus} from "../../use/useStyle";
import {VNodeChild} from "../../shims";
import Dialog from '../dialog'
import {registryRootService} from "../root/root-service";
import {createDefaultManager} from "../root/root-service-default-manager";
import Service from './dialog-service'
import {App} from 'vue';
import {DialogService} from "../../index";
import {installPlugin} from "../../utils/installPlugin";

export enum DialogServiceEditType {
    input = 'input',
    textarea = 'textarea'
}

export interface DialogServiceOption {
    message?: string,                                               // 提示的消息
    editType?: DialogServiceEditType,                               // 输入类型
    editValue?: string | number,                                    // 输入初始内容
    editReadonly?: boolean,                                         // 输入框只读
    status?: StyleStatus,                                           // 对话框状态
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

type DialogServiceFunction = (message: string | DialogServiceOption, option?: DialogServiceOption) => void
type DialogService = {
    [k in StyleStatus]: DialogServiceFunction
}

const getDialogService = registryRootService(
    'dialog',
    createDefaultManager('pl-dialog-manager', Service),
    (getController) => {
        const service = async (message: string | DialogServiceOption, option?: DialogServiceOption) => {
            const o: DialogServiceOption = typeof message === "string" ? {message} : message
            if (!!option) {
                Object.assign(o, option)
            }
            const controller = await getController()
            const service = await controller.getService(o)
            service.show(o)
        }

        return Object.assign(service, Object.keys(StyleStatus).reduce((prev: any, status: any) => {
            prev[status] = async function (message: string | DialogServiceOption, option?: DialogServiceOption) {
                const o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                o.status = status
                return service(o)
            }
            return prev
        }, {})) as DialogService
    }
)

export default {
    install(app: App) {
        installPlugin(app, Dialog)
        app.mixin({
            computed: {
                $dialog() {
                    return getDialogService(this)
                },
            },
        })
    },
}