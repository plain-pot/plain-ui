import {App} from 'vue'
import {ComponentPlugin} from "../shims";
import {installPlugin} from "./installPlugin";
import {toArray} from "./toArray";
import Root from '../packages/root'

export function createComponentPlugin<Component extends { name: string }>(
    component: Component,
    plugins?: ComponentPlugin[]
) {
    return {
        ...component,
        install(app: App) {
            installPlugin(app, Root)
            const components = toArray(component)
            components.forEach(component => app.component(component.name, component))
            !!plugins && (installPlugin(app, plugins))
        },
    }
}