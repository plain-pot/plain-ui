import {GetPage, PageConfig} from "../src/packages/nav/NavigatorManager";

export interface MicroAppConfig {
    name: string,                                               // 子应用名称
    pattern: RegExp,                                            // 子应用匹配页面的路径
    url?: string,                                               // 子应用入口html文件资源地址
    getPage?: GetPage,                                          // 子应用获取页面的方式
}

export type MicroAppLoader =
    {
        getPage: GetPage
    } |
    {
        mount: (el: HTMLDivElement, pageConfig: PageConfig) => Promise<any>,
        unmount: (data: any) => Promise<void>
    }

export interface MicroApp {
    config: MicroAppConfig,
    assetPublicPath?: string,
    loadWork?: Promise<MicroAppLoader>,
    loader?: MicroAppLoader,
}

export function createLocalModule(config: Exclude<MicroAppConfig, 'url'> & Required<Pick<MicroAppConfig, 'getPage'>>): MicroAppConfig {
    return config
}

export function createSubApplication(config: Exclude<MicroAppConfig, 'getPage'>): MicroAppConfig {
    return config
}