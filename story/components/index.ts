import {App} from "vue";
import {DemoLine} from "./DemoLine";
import {DemoRow} from "./DemoRow";

export const installDemoComponent = (app: App) => {
    app.component('demo-line', DemoLine)
    app.component('demo-row', DemoRow)
}
