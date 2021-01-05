import {reactive, computed} from 'vue';
import {createCounter} from "../../utils/createCounter";

const nextStackId = createCounter('navigator_stack')
const nextPageId = createCounter('navigator_page')

/*路由模式*/
export enum NavRouteMode {
    hash = 'hash',
    history = 'history',
}

/*跳转页面信息*/
interface Page {
    title: string,                                  // 页面标题
    path: string,                                   // 第一个页面的路径
    icon?: string,                                  // 图标
    param?: string,                                 // 页面参数
    query?: Record<string, any>,                    // 路由的query参数
    data?: any,                                     // 额外的数据
}

/*Page在Stack中具体信息*/
interface StackPage {
    page: Page,                                     // 页面信息
    init: boolean,                                  // 页面是否已经初始化
    loading: boolean,                               // 页面是否处于加载状态
}

export interface Stack {
    id: string,                                     // 页面栈id
    page: Page,                                     // 页面栈初始化的page
    pages: StackPage[],                             // 页面栈数组
    show: boolean,                                  // 页面栈是否显示
}

/*生成stack的唯一标识的id*/
type GenerateStackId = (page: Page) => string

/*创建NavigatorManager的配置参数*/
interface NavigatorManagerConfig {
    routerMode: NavRouteMode,                       // 路由模式，解析url的时候是哈希路由还是history路由
    defaultPage: Page,                              // 当没有指定路由，也没有缓存的页面时，默认打开的页面
    generateStackId?: GenerateStackId,
    storageKey?: string,                            // 多页面应用中可能会存在缓存冲突的问题。通过这个属性可以隔离多页面应用之间的缓存
    maxStack?: number,                              // 最大的可以打开的stack个数
}

/*创建Stack*/
function createStack(config: { generateStackId?: GenerateStackId, page: Page, }): Stack {
    return {
        id: (config.generateStackId || nextStackId)(config.page),
        page: config.page,
        pages: [],
        show: false,
    }
}

export function createNavigatorManager(config: NavigatorManagerConfig) {
    const state = reactive({
        stacks: [] as Stack[],
    })
    /*当前正在显示的tab*/
    const currentStack = computed(() => state.stacks.filter(s => s.show).shift())

    /*---------------------------------------page stack-------------------------------------------*/
    /*打开一个tab*/
    const openTab = async (page: Page) => {
        const newStack = createStack({page, generateStackId: config.generateStackId})
        state.stacks.push(newStack)
        await hideTab()
        await showTab(newStack.id)
    }
    /*关闭tab*/
    const closeTab = () => {/*todo*/}
    /*刷新tab*/
    const refreshTab = () => {/*todo*/}
    /*获取当前tab*/
    const getCurrentTab = () => {/*todo*/}
    /*显示tab*/
    const showTab = async (stackId: string) => {
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
    }
    /*隐藏当前显示的tab*/
    const hideTab = async () => {
        const current = currentStack.value
        if (!!current) {
            current.show = false
        }
    }
    /*---------------------------------------page-------------------------------------------*/
    /*push一个页面*/
    const push = () => {/*todo*/}
    /*pop一个页面*/
    const back = () => {/*todo*/};
    /*重定向到一个页面*/
    const redirect = () => {/*todo*/}
    /*刷新页面*/
    const refresh = () => {/*todo*/}
    /*开启/关闭页面的加载状态*/
    const loading = () => {/*todo*/}
    /*获取当前页面信息*/
    const getCurrentPage = () => {/*todo*/}

    return {
        /*stack methods*/
        openTab,
        closeTab,
        refreshTab,
        getCurrentTab,
        showTab,
        /*page methods*/
        push,
        back,
        redirect,
        refresh,
        loading,
        getCurrentPage,

        state,
    }
}

export type NavigatorManager = ReturnType<typeof createNavigatorManager>