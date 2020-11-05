import {App} from "vue";
import {VNodeChild} from "../../shims";
import {RootController} from "../root";
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
    horizontal?: MessageServiceDirection,                                                           // 横向位置
    vertical?: MessageServiceDirection,                                                             // 纵向位置
    message: string,                                                                                // 消息文本
    time?: number | null,                                                                           // 显示的时间
    status?: MessageServiceStatus,                                                                  // 消息状态
    render: () => VNodeChild,                                                                       // 自定义内容渲染函数
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
            time: option.time === null ? null : 3 * 1000,
            status: option.status || 'dark'
        })
    }
})()

export default createComponentPlugin(Controller, [
    Icon, List, Item,
    {
        install: (app: App) => {
            app.config.globalProperties.$message = async function (option: MessageServiceOption) {
                const fo = formatOption(option)
                const root = RootController.getRoot(this.$root)
                /*获取一个 Controller 实例，没有就给我创建一个*/
                const controller = (await root.getController('message', Controller)) as any as typeof Controller.use.class
                /*获取以一个Container实例，没有就给我创建一个*/
                const container = (await controller.getContainer(fo))
                await container.getMessage(fo)
            }
        }
    }
])
