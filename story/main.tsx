import {createApp} from 'vue'
import PlainUi from '../src'
import './init/index'
import App from './App'

const app = createApp(App)
app.use(PlainUi)
app.mount('#app')
