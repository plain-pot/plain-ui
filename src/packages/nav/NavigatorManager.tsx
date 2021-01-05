import {reactive, computed} from 'vue';
import {createCounter} from "../../utils/createCounter";

const nextStackId = createCounter('navigator_stack')
const nextPageId = createCounter('navigator_page')

/*路由模式*/
export enum NavRouteMode {
    hash = 'hash',
    history = 'history',
}

/*生成stack的唯一标识的id*/
type GenerateStackId = (pageConfig: PageConfig) => string
/*获取页面组件对象*/
export type GetPage = (pageConfig: PageConfig) => Promise<any>
/*打开页面的时候的标题*/
type PageConfigTitle = string | ((pageConfig: string) => string)

/*跳转页面信息*/
interface PageConfig {
    title: PageConfigTitle,                                     // 页面标题
    path: string,                                               // 第一个页面的路径
    icon?: string,                                              // 图标
    param?: string,                                             // 页面参数（动态路由参数也是放这里边的）
    query?: Record<string, any>,                                // 路由的query参数
    data?: any,                                                 // 额外的数据
}

/*Page在Stack中具体信息*/
export interface Page {
    id: string,                                                 // 页面标识
    pageConfig: PageConfig,                                     // 页面信息
    init: boolean,                                              // 页面是否已经初始化
    loading: boolean,                                           // 页面是否处于加载状态
}

/*页面栈信息*/
export interface Stack {
    id: string,                                                 // 页面栈id
    pageConfig: PageConfig,                                     // 页面栈初始化的page
    pages: Page[],                                              // 页面栈数组
    show: boolean,                                              // 页面栈是否显示
}

/*创建NavigatorManager的配置参数*/
interface NavigatorManagerConfig {
    routerMode: NavRouteMode,                                   // 路由模式，解析url的时候是哈希路由还是history路由
    defaultPage: PageConfig,                                    // 当没有指定路由，也没有缓存的页面时，默认打开的页面
    getPage: GetPage,                                           // 根据PageConfig获取页面组件对象
    storageKey?: string,                                        // 多页面应用中可能会存在缓存冲突的问题。通过这个属性可以隔离多页面应用之间的缓存
    maxStack?: number,                                          // 最大的可以打开的stack个数
    generateStackId?: GenerateStackId,
}

export function createNavigatorManager(config: NavigatorManagerConfig) {
    const state = reactive({
        stacks: [] as Stack[],
    })
    /*当前正在显示的tab*/
    const currentStack = computed(() => state.stacks.filter(s => s.show).shift())

    /*---------------------------------------utils-------------------------------------------*/
    const utils = {
        /*创建Page*/
        createPage: (pageConfig: PageConfig): Page => {
            return {
                id: nextPageId(),
                pageConfig,
                init: false,
                loading: false,
            }
        },
        /*创建Stack*/
        createStack: (pageConfig: PageConfig): Stack => {
            return {
                id: (config.generateStackId || nextStackId)(pageConfig),
                pageConfig: pageConfig,
                pages: [utils.createPage(pageConfig),],
                show: false,
            }
        },
        /*获取页面组件*/
        getPage: (pageConfig: PageConfig) => config.getPage(pageConfig),
    }
    const tabMethods = {
        /*打开一个tab*/
        openTab: async (pageConfig: PageConfig) => {
            const newStack = utils.createStack(pageConfig)
            state.stacks.push(newStack)
            await tabMethods.hideTab()
            await tabMethods.showTab(newStack.id)
        },
        /*关闭tab*/
        closeTab: () => {/*todo*/},
        /*刷新tab*/
        refreshTab: () => {/*todo*/},
        /*获取当前tab*/
        getCurrentTab: () => {/*todo*/},
        /*显示tab*/
        showTab: async (stackId: string) => {
            const stack = state.stacks.find(item => item.id === stackId)
            if (!!stack) {
                stack.show = true
                /*渲染最后两个页面*/
                if (stack.pages.length > 0 && !stack.pages[stack.pages.length - 1].init) {
                    stack.pages[stack.pages.length - 1].init = true
                }
                if (stack.pages.length > 1 && !stack.pages[stack.pages.length - 2].init) {
                    stack.pages[stack.pages.length - 2].init = true
                }
            }
        },
        /*隐藏当前显示的tab*/
        hideTab: async () => {
            const current = currentStack.value
            if (!!current) {
                current.show = false
            }
        },
    }
    const pageMethods = {
        /*push一个页面*/
        push: () => {/*todo*/},
        /*pop一个页面*/
        back: () => {/*todo*/},
        /*重定向到一个页面*/
        redirect: () => {/*todo*/},
        /*刷新页面*/
        refresh: () => {/*todo*/},
        /*开启/关闭页面的加载状态*/
        loading: () => {/*todo*/},
        /*获取当前页面信息*/
        getCurrentPage: () => {/*todo*/},
    }

    /*执行初始化逻辑*/
    const init = async () => {
        /*根据路由地址初始化*/
        /*根据缓存初始化*/
        /*根据defaultPage初始化*/
        await tabMethods.openTab(config.defaultPage)
    }

    return {
        utils,
        ...tabMethods,
        ...pageMethods,
        state,
        init,
    }
}

export type NavigatorManager = ReturnType<typeof createNavigatorManager>