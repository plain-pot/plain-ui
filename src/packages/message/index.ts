import {App} from "vue";
import {VNodeChild} from "../../shims";
import {registryRootService} from "../root/root-service";
import ManagerComponent from './message-manager'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import './message.scss'
import Icon from '../icon'
import List from '../list'
import Item from '../item'

/**
 * 消息位置
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
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
    render?: () => VNodeChild,                                                                      // 自定义内容渲染函数
    icon?: string | null,                                                                           // 显示的图标
    onClick?: (e: MouseEvent) => void,                                                              // 自定义点击处理动作
    onClose?: () => void,                                                                           // 处理消息关闭之后的动作
}

/**
 * 消息配置对象类型格式化后的类型
 * @author  韦胜健
 * @date    2020/11/7 18:20
 */
export interface MessageServiceFormatOption extends MessageServiceOption {
    id: string,
    close: () => void,                                                                              // 非配置选项，当消息显示后，这个close函数会初始化，调用这个函数将关闭该消息

    horizontal: MessageServiceDirection,
    vertical: MessageServiceDirection,
    time: number | null,
    status: MessageServiceStatus,
}

/**
 * 格式化消息配置参数
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
const formatOption = (() => {
    let idCount = 0
    return (option: MessageServiceOption): MessageServiceFormatOption => {
        return Object.assign(option, {
            id: `message_${idCount++}`,
            close: () => null,
            horizontal: option.horizontal || MessageServiceDirection.center,
            vertical: option.vertical || MessageServiceDirection.start,
            time: option.time === null ? null : (option.time || 3 * 1000),
            status: option.status || 'dark'
        })
    }
})()

/**
 * 消息服务函数类型
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
interface MessageServiceFunction {
    (message: string | MessageServiceOption, option?: MessageServiceOption): void
}

/**
 * 消息服务对象类型
 * @author  韦胜健
 * @date    2020/11/7 18:21
 */
export type MessageService = MessageServiceFunction & {
    [k in MessageServiceStatus]: MessageServiceFunction
}

/**
 * 通过应用实例获取消息服务对象函数
 * @author  韦胜健
 * @date    2020/11/7 18:22
 */
const getMessageService = registryRootService(
    'message',
    ManagerComponent,
    (getController) => {
        const service: MessageServiceFunction = async (message: string | MessageServiceOption, option?: MessageServiceOption) => {
            let o = typeof message === "object" ? message : {message}
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o)
            fo.horizontal.charAt(0)
            const controller = await getController()
            const container = await controller.getContainer(fo)
            await container.getMessage(fo)
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
            prev[status] = async function (message: string | MessageServiceOption, option?: MessageServiceOption) {
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
)

export default createComponentPlugin({
    ...ManagerComponent,
    getMessageService,
}, [
    Icon, List, Item,
    {
        install: (app: App) => {
            app.mixin({
                computed: {
                    $message() {
                        return getMessageService(this)
                    },
                },
            })
        }
    }
])