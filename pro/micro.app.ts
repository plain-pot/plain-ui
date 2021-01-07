import {GetPage, PageConfig} from "../src/packages/nav/NavigatorManager";

/**
 * 子应用配置信息对象
 * @author  韦胜健
 * @date    2021/1/7 16:17
 */
export interface MicroAppConfig {
    name: string,                                               // 子应用名称
    pattern: RegExp,                                            // 子应用匹配页面的路径
    url?: string,                                               // 子应用入口html文件资源地址
    loader?: MicroAppLoader,                                    // 应用页面的加载方式
}

/**
 * 子应用页面加载方式
 * - getPage 主应用子模块的加载方式，子模块的页面与主应用的页面使用相同的所有功能
 * - mount，unmount：由子应用自己挂载页面。
 * - iframe，嗯哼？
 * @author  韦胜健
 * @date    2021/1/7 16:18
 */
export type MicroAppLoader =
    {
        getPage: GetPage
    } |
    {
        mount: (el: HTMLDivElement, pageConfig: PageConfig) => Promise<any>,
        unmount: (data: any) => Promise<void>
    };

/**
 * 主应用信息对象
 * @author  韦胜健
 * @date    2021/1/7 16:20
 */
export interface MicroApp {
    config: MicroAppConfig,
    assetPublicPath?: string,
    loadWork?: Promise<MicroAppLoader>,
    loader?: MicroAppLoader,
}

export function createLocalModule(config: Exclude<MicroAppConfig, 'url'> & Required<Pick<MicroAppConfig, 'loader'>>): MicroAppConfig {
    return config
}

export function createSubApplication(config: Exclude<MicroAppConfig, 'loader'>): MicroAppConfig {
    return config
}