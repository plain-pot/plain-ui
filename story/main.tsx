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

app.config.warnHandler = function (msg, vm, trace) {
    // `trace` 是组件的继承关系追踪
    // todo, 监听驼峰命名的事件会有警告，这里忽略
    if (msg.startsWith('Extraneous non-emits event listeners')) {
        return
    }
    console.warn(msg, {vm, trace})
}

app.mount('#app')
