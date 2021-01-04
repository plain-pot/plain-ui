export enum NavRouteMode {
    hash = 'hash',
    history = 'history',
}

export interface StackPage {
    /*基础属性*/
    title: string,                                  // 页面标题
    path: string,                                   // 第一个页面的路径
    param: string,                                  // 第一个页面的参数
    query?: Record<string, any>,                    // 路由的query参数
    /*其他属性*/
    data?: any,                                     // 额外的数据
    originalPath: string,                           // 原始的路由地址
}