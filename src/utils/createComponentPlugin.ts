import {App} from 'vue'
import {ComponentPlugin} from "../shims";
import "../packages/public"
import {installPlugin} from "./installPlugin";
import {toArray} from "./toArray";

export function createComponentPlugin<Component extends { name: string }>(
    component: Component,
    plugins?: ComponentPlugin[]
) {
    return {
        ...component,
        install(app: App) {
            const components = toArray(component)
            components.forEach(component => app.component(component.name, component))
            !!plugins && (installPlugin(app, plugins))
        },
    }
}