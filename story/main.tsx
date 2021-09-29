import {createApp} from 'vue'
import PlainUi from '../src'
console.log(PlainUi)
import './init/index'
import App from './App'
import {installDemoComponent} from "./components";

const app = createApp(App)
app.use(PlainUi)
app.use({install: installDemoComponent})
app.mount('#app')
