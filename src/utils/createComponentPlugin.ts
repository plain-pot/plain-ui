import {App} from 'vue'
import {ComponentPlugin} from "../shims";

export function createComponentPlugin<Component extends { name: string }>(
    component: Component,
    plugins?: ComponentPlugin[]
) {
    return {
        ...component,
        install(app: App) {
            app.component(component.name, component);
            !!plugins && plugins.forEach(app.use)
        },
    }
}