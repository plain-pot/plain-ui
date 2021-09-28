/**
 * 消息位置
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
import {createServiceWithoutContext, createUseService} from "../PlRoot/registryRootService";
import {PlMessageManager} from "./PlMessageManager";
import {STATUS} from "../../utils/constant";
import {VueNode} from "plain-design-composition";
import {RequireFormat} from "../../utils/type";

export enum MessageServiceDirection {
    start = 'start',
    center = 'center',
    end = 'end',
}

/**
 * 消息状态
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
export type MessageServiceStatus = "lite" | "dark" | "primary" | "success" | "warn" | "error" | "info"

/**
 * 消息配置对象类型
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
export interface MessageServiceOption {
    message?: string,                                                                               // 消息文本

    horizontal?: MessageServiceDirection,                                                           // 横向位置
    vertical?: MessageServiceDirection,                                                             // 纵向位置
    time?: number | null,                                                                           // 显示的时间
    status?: MessageServiceStatus,                                                                  // 消息状态
    render?: () => VueNode,                                                                      // 自定义内容渲染函数
    icon?: string | null,                                                                           // 显示的图标
    onClick?: (e: MouseEvent) => void,                                                              // 自定义点击处理动作
    onClose?: () => void,                                                                           // 处理消息关闭之后的动作
}

/**
 * 消息配置对象类型格式化后的类型
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
export type MessageServiceFormatOption = RequireFormat<MessageServiceOption, 'horizontal' | 'vertical' | 'time' | 'status'> & {
    id: string,
    close: () => void,
}

/**
 * 格式化消息配置参数
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
const formatOption = (() => {
    let idCount = 0
    return (option: MessageServiceOption): MessageServiceFormatOption => {

        const status = option.status === null ? null : (option.status || 'primary')

        return Object.assign(option as MessageServiceFormatOption, {
            id: `message_${idCount++}`,
            close: () => null,
            horizontal: option.horizontal || MessageServiceDirection.center,
            vertical: option.vertical || MessageServiceDirection.start,
            time: option.time === null ? null : (option.time || 3 * 1000),
            status,
            icon: option?.icon !== undefined ? option.icon : (!status ? null : STATUS[status].icon),
        })
    }
})()

/**
 * 消息服务函数类型
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
interface MessageServiceFunction {
    (message: string | MessageServiceOption, option?: MessageServiceOption): MessageServiceFormatOption
}

/**
 * 消息服务对象类型
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
export type MessageService = MessageServiceFunction & {
    [k in MessageServiceStatus]: MessageServiceFunction
}

export const useMessage = createUseService({
    name: 'message-service',
    managerComponent: PlMessageManager,
    createService: (getManager) => {
        const service: MessageServiceFunction = (message: string | MessageServiceOption, option?: MessageServiceOption) => {
            let o = typeof message === "object" ? message : {message}
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o)
            fo.horizontal.charAt(0)
            getManager().then(manager => manager.getContainer(fo).then(container => container.getMessage(fo)))
            return fo
        };

        return Object.assign(service, [
            'lite',
            'dark',
            'primary',
            'success',
            'warn',
            'error',
            'info',
        ].reduce((prev: any, status: any) => {
            prev[status] = function (message: string | MessageServiceOption, option?: MessageServiceOption) {
                const o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                o.status = status
                return service(o)
            }
            return prev
        }, {})) as MessageService
    }
})

export default useMessage
