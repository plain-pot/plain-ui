import {reactive} from "vue"

export type AppRoute = {
    path: string,
    hash: string,
}

const getRoute = (): AppRoute => {
    let uri = decodeURIComponent(window.location.hash || '')
    if (uri.charAt(0) === '#' && uri.length > 0) {uri = uri.substring(1)}
    let [path, hash] = uri.split('#')
    if (!!path && path.charAt(0) === '/') {
        path = path.slice(1)
    }
    return {
        path,
        hash,
    }
}

export const Router = (() => {
    const state = reactive({
        route: getRoute(),
        go: (path: string) => {window.location.hash = encodeURIComponent(path)},
    })
    window.addEventListener('hashchange', () => {
        state.route = getRoute()
    })
    return state
})();