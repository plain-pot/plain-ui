import {designComponent} from "@/use/designComponent";
import {reactive, onMounted, getCurrentInstance} from 'vue';

export type AppRoute = {
    path: string,
    hash: string,
}

export function getRoute(): AppRoute {
    let uri = decodeURIComponent(window.location.hash || '')
    if (uri.charAt(0) === '#' && uri.length > 0) {
        uri = uri.substring(1)
    }
    let [path, hash] = uri.split('#')
    if (!!path && path.charAt(0) === '/') {
        path = path.slice(1)
    }
    return {
        path,
        hash,
    }
}

export const AppNavigator = designComponent({
    name: 'app-navigator',
    provideRefer: true,
    props: {
        defaultPath: {type: String,},
    },
    setup({props, setupContext}) {

        const pathChangeListener = [] as ((route: AppRoute) => void)[]
        const hashChangeListener = [] as ((route: AppRoute) => void)[]
        const pageReadyListener = [] as ((route: AppRoute) => void)[]

        const ctx = getCurrentInstance()!

        const nav = reactive({
            route: getRoute(),
            go: (path: string, hash?: string) => {
                window.location.hash = encodeURIComponent(`${path}${!!hash ? '#' + hash : ''}`)
            },
            on: {
                /**
                 * 监听path变化动作
                 * @author  韦胜健
                 * @date    2020/9/17 11:25
                 */
                pathChange: (listener: (route: AppRoute) => void) => {
                    pathChangeListener.push(listener)
                    return () => {
                        pathChangeListener.splice(pathChangeListener.indexOf(listener), 1)
                    }
                },
                /**
                 * 监听hash变化动作
                 * @author  韦胜健
                 * @date    2020/9/17 11:25
                 */
                hashChange: (listener: (route: AppRoute) => void) => {
                    hashChangeListener.push(listener)
                    return () => {
                        hashChangeListener.splice(hashChangeListener.indexOf(listener), 1)
                    }
                },
                /**
                 * 页面加载完毕动作
                 * @author  韦胜健
                 * @date    2020/10/10 10:18
                 */
                pageReady: (listener: (route: AppRoute) => void) => {
                    pageReadyListener.push(listener)
                    return () => {
                        pageReadyListener.splice(pageReadyListener.indexOf(listener), 1)
                    }
                },
            },
            emit: {
                hashChange: () => {
                    hashChangeListener.forEach(item => item(getRoute()))
                },
                pathChange: () => {
                    pathChangeListener.forEach(item => item(getRoute()))
                },
                pageReady: () => {
                    pageReadyListener.forEach(item => item(getRoute()))
                }
            }
        })

        onMounted(() => {
            if (!nav.route.path) {
                if (!!props.defaultPath) {
                    nav.route = {
                        path: props.defaultPath,
                        hash: '',
                    }
                    pathChangeListener.forEach(item => item(nav.route))
                }
            }
            window.addEventListener('hashchange', () => {
                const route = getRoute()
                const {path, hash} = route
                if (path !== nav.route.path) {
                    nav.emit.pathChange()
                } else if (hash !== nav.route.hash) {
                    nav.emit.hashChange()
                }
                nav.route = route
            })
        })

        return {
            refer: {
                nav,
            },
            render() {
                return (
                    !!ctx.slots.default ? ctx.slots.default() : null
                )
            },
        }
    },
})