import {createApp} from 'vue'
import App from './app.vue'
import PlainUi, {Icon} from "../src/index";
import {installDemoComponent} from "./components";

const app = createApp(App)
app.use(PlainUi)

Icon.registry('my-icon-', (icon) => {
    return <i class={`my-icon-${icon}`}>{icon}</i>
})

installDemoComponent(app)

app.mount('#app')
