import {createApp} from 'vue'
import {ComponentPlugin} from "../shims";
import {installPlugin} from "./installPlugin";

export function newInstance<Component>(component: Component, config: {
    el?: HTMLElement,
    parentNode?: HTMLElement,
    plugins?: ComponentPlugin[],
} = {}) {
    let {el, parentNode} = config
    if (!el) {
        el = document.createElement('div')
        if (!!parentNode) {
            parentNode.appendChild(el)
        } else {
            document.body.appendChild(el)
        }
    }
    const app = createApp(component)
    if (!!config.plugins) {
        config.plugins.forEach(plugin => installPlugin(app, plugin))
    }
    const ins = app.mount(el) as Component extends { use: { class: infer C } } ? C : any
    return {
        app,
        ins,
        el,
    }
}