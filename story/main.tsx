import {createApp} from 'vue'
import App from './app.vue'
import PlainUi, {Icon} from "../src/index";

const app = createApp(App)
app.use(PlainUi)

Icon.registry('my-icon-', (icon) => {
    return <i class={`my-icon-${icon}`}>{icon}</i>
})

app.mount('#app')
