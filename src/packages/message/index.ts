import {App} from "vue";
import {VNodeChild} from "../../shims";
import {RootController} from "../root";
import Controller from './message-controller'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import './message.scss'
import Icon from '../icon'

export enum MessageServiceDirection {
    start = 'start',
    center = 'center',
    end = 'end',
}

const nextId = (() => {
    let count = 0
    return () => `message_${count++}`
})()

export interface MessageServiceOption {
    horizontal?: MessageServiceDirection,                                                           // 横向位置
    vertical?: MessageServiceDirection,                                                             // 纵向位置
    message: string,                                                                                // 消息文本
    time?: number,                                                                                  // 显示的时间
    status?: "lite" | "dark" | "primary" | "success" | "warn" | "error" | "info",                   // 消息状态
    render: () => VNodeChild,                                                                       // 自定义内容渲染函数
    icon?: string | null,                                                                           // 显示的图标
    onClick: (e: MouseEvent) => void,                                                               // 自定义点击处理动作
    onClose: () => void,                                                                            // 处理消息关闭之后的动作

    id?: string,
    close?: () => void,                                                                             // 非配置选项，当消息显示后，这个close函数会初始化，调用这个函数将关闭该消息
}

export default createComponentPlugin(Controller, [
    Icon,
    {
        install: (app: App) => {
            app.config.globalProperties.$message = async function (option: MessageServiceOption) {
                option.id = nextId()
                const root = RootController.getRoot(this.$root)
                /*获取一个 Controller 实例，没有就给我创建一个*/
                const controller = (await root.getController('message', Controller)) as any as typeof Controller.use.class
                /*获取以一个Container实例，没有就给我创建一个*/
                const container = (await controller.getContainer({
                    horizontal: option.horizontal || MessageServiceDirection.center,
                    vertical: option.vertical || MessageServiceDirection.start,
                }))
                const message = (await container.getMessage(option))

                /*const service = await controller.getService(option)
                if (!!service) {
                    console.log(service)
                }*/
            }
        }
    }
])
