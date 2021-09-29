import {StyleStatus} from "../../use/useStyle";
import {SimpleFunction, VueNode} from "plain-ui-composition"
import {STATUS} from "../../utils/constant";
import {createUseService} from "../PlRoot/registryRootService";
import {PlNoticeManager} from "./PlNoticeManager";
import {RequireFormat} from "../../utils/type";

export enum NoticeServiceDirection {
    start = 'start',
    end = 'end',
}

export interface NoticeServiceOption {
    title?: string | null,                              // 标题
    message?: string,                                   // 通知消息
    time?: number | null,                               // 停留时间
    status?: StyleStatus | null,                        // 状态
    icon?: string,                                      // 显示图标
    noClose?: boolean,                                  // 不显示关闭按钮
    renderHead?: () => VueNode,                       // 自定义头部内容
    renderContent?: () => VueNode,                    // 自定义内容
    renderFoot?: () => VueNode,                       // 自定义底部内容
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

        const status = option.status === null ? null : (option.status || 'primary')

        return Object.assign(option as NoticeServiceFormatOption, {
            title: option.title === null ? null : (option.title || '消息提示'),
            id: `message_${idCount++}`,
            time: option.time === null ? null : (option.time || 3 * 1000),
            status,
            icon: option.icon || (!status ? null : STATUS[status].icon),
            horizontal: option.horizontal || NoticeServiceDirection.end,
            vertical: option.vertical || NoticeServiceDirection.start,
            close: () => undefined,
        })
    }
})()

export interface NoticeServiceFunction {
    (message: string | NoticeServiceOption, option?: NoticeServiceOption): NoticeServiceFormatOption
}

export type NoticeService = NoticeServiceFunction & { [k in 'primary' | 'success' | 'warn' | 'error' | 'info']: NoticeServiceFunction }

export const useNotice = createUseService({
    name: 'notice-service',
    optionsCallName: '$notice',
    managerComponent: PlNoticeManager,
    createService(getManager) {
        const service: NoticeServiceFunction = (message: string | NoticeServiceOption, option?: NoticeServiceOption): NoticeServiceFormatOption => {
            let o = typeof message === "object" ? message : {message}
            if (!!option) {
                Object.assign(o, option)
            }
            const fo = formatOption(o);
            getManager().then(manager => manager.getContainer(fo).then(container => container.getNotice(fo)))
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
            prev[status] = function (message: string | NoticeServiceOption, option?: NoticeServiceOption) {
                const o = typeof message === "object" ? message : {message}
                if (!!option) {
                    Object.assign(o, option)
                }
                o.status = status
                return service(o)
            }
            return prev
        }, {})) as NoticeService
    },
})

export default useNotice
