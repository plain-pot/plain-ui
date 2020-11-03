import {App} from 'vue'
import {ComponentPlugin} from "../shims";
import {installPlugin} from "./installPlugin";

export function createComponentPlugin<Component extends { name: string }>(
    component: Component,
    plugins?: ComponentPlugin[]
) {
    return {
        ...component,
        install(app: App) {
            app.component(component.name, component);
            !!plugins && (installPlugin(app, plugins))
        },
    }
}