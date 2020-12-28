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
};

(window as any).MockData = {
    data: async () => (await import('./pages/data/data.json')).default,
    data1: async () => (await import('./pages/data/data-1.json')).default,
    data2: async () => (await import('./pages/data/data-2.json')).default,
    treeData: async () => (await import('./pages/data/tree.data.json')).default,
    address: async () => (await import('./pages/data/address.json')).default,
}

app.mount('#app')
