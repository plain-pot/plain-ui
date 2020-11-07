import {App, ComponentPublicInstance} from "vue";
import {VNodeChild} from "../../shims";
import {RootController} from "../root/root-service";
import Controller from './message-controller'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import './message.scss'
import Icon from '../icon'
import List from '../list'
import Item from '../item'

export enum MessageServiceDirection {
    start = 'start',
    center = 'center',
    end = 'end',
}

export type MessageServiceStatus = "lite" | "dark" | "primary" | "success" | "warn" | "error" | "info"

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

export interface MessageServiceFormatOption extends MessageServiceOption {
    horizontal: MessageServiceDirection
    vertical: MessageServiceDirection
    time: number | null
    status: MessageServiceStatus,

    id: string,
    close: () => void,                                                                              // 非配置选项，当消息显示后，这个close函数会初始化，调用这个函数将关闭该消息
}

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

interface MessageServiceFunction {
    (message: string | MessageServiceOption, option?: MessageServiceOption): void
}

export type MessageService = MessageServiceFunction & {
    [k in MessageServiceStatus]: MessageServiceFunction
}

const getMessageServiceByRoot = (() => {

    const map = new WeakMap<ComponentPublicInstance, any>()

    return ($root: ComponentPublicInstance): MessageService => {
        const service = map.get($root)
        if (!!service) {
            return service
        } else {
            const service = async (message: string | MessageServiceOption, option?: MessageServiceOption) => {
                let o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                const fo = formatOption(o)
                const root = RootController.getRoot($root)
                /*获取一个 Controller 实例，没有就给我创建一个*/
                const controller = (await root.getController('message', Controller))
                /*获取以一个Container实例，没有就给我创建一个*/
                const container = (await controller.getContainer(fo))
                await container.getMessage(fo)
            };

            const targetService = Object.assign(service, [
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
            }, {} as { [k in MessageServiceStatus]: (message: string, option?: Omit<MessageServiceOption, 'message'>) => void }))

            map.set($root, service)
            return targetService
        }
    }
})()

export default createComponentPlugin(Controller, [
    Icon, List, Item,
    {
        install: (app: App) => {
            app.mixin({
                computed: {
                    $message() {
                        return getMessageServiceByRoot(this.$root)
                    },
                },
            })
        }
    }
])
