import {App} from 'vue'
import {ComponentPlugin} from "../shims";

export function installPlugin(
    component: { name: string },
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