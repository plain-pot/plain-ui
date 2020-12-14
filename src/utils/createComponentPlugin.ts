import {App} from 'vue'
import {ComponentPlugin} from "../shims";
import {installPlugin} from "./installPlugin";
import {toArray} from "./toArray";
import Root from '../packages/root'

export function createComponentPlugin<Component extends { name: string }, Expose extends Record<string, any>>(
    component: Component,
    plugins?: ComponentPlugin[],
    expose?: Expose
) {

    return Object.assign(component, {
        install(app: App) {
            installPlugin(app, Root)
            const components = toArray(component)
            components.forEach(component => app.component(component.name, component))
            !!plugins && (installPlugin(app, plugins))
        },
        ...expose,
    })
}