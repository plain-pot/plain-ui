import {App} from 'vue';
import {DemoRow} from "./demo-row";
import {DemoLine} from "./demo-line";
import DemoChild from './demo-child.vue'

export function installDemoComponent(app: App) {
    app.component(DemoRow.name, DemoRow)
    app.component(DemoLine.name, DemoLine)
    app.component(DemoChild.name, DemoChild)
}