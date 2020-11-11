import {StyleStatus} from "../../use/useStyle";
import {registryRootService} from "../root/root-service";
import {RequireFormat, SimpleFunction} from "../../shims";
import ManagerComponent from './notice-manager'
import {App} from 'vue';

export enum NoticeServiceDirection {
    start = 'start',
    end = 'end',
}

export interface NoticeServiceOption {
    message?: string,                                   // 通知消息
    time?: number,                                      // 停留时间
    icon?: string,                                      // 显示图标
    noClose?: boolean,                                  // 不显示关闭按钮
    render?: Function,                                  // 自定义内容函数
    status?: StyleStatus,                               // 状态
    onClick?: SimpleFunction,                           // 点击事件处理函数
    onClose?: SimpleFunction,                           // 关闭处理函数
    vertical?: NoticeServiceDirection,                  // 纵向位置
    horizontal?: NoticeServiceDirection,                // 横向位置
}

export type NoticeServiceFormatOption = RequireFormat<NoticeServiceOption, 'time' | 'status' | 'vertical' | 'horizontal'> & {
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
    return (option: NoticeServiceOption): NoticeServiceFormatOption => {
        return Object.assign(option as NoticeServiceFormatOption, {
            id: `message_${idCount++}`,
            time: option.time === null ? null : (option.time || 3 * 1000),
            status: option.status || 'dark',
            horizontal: option.horizontal || NoticeServiceDirection.end,
            vertical: option.vertical || NoticeServiceDirection.start,
            close: () => undefined,
        })
    }
})()

export interface NoticeServiceFunction {
    (message: string | NoticeServiceOption, option?: NoticeServiceOption): void
}

export type NoticeService = NoticeServiceFunction & { [k in keyof StyleStatus]: NoticeServiceFunction }

const getNoticeService = registryRootService(
    'notice',
    ManagerComponent,
    (getController) => {
        const service: NoticeServiceFunction = async (message: string | NoticeServiceOption, option?: NoticeServiceOption) => {
            let o = typeof message === "object" ? message : {message}
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o)
            const controller = await getController()
            const container = await controller.getContainer(fo)
            await container.getNotice(fo)
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
            prev[status] = async function (message: string | NoticeServiceOption, option?: NoticeServiceOption) {
                const o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                o.status = status
                return service(o)
            }
            return prev
        }, {})) as NoticeService
    }
)

export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$notice', {
                    get() {
                        return getNoticeService(this)
                    },
                })
            }
        })
    },
}