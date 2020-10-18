import {createApp} from 'vue'
import App from './app.vue'
import PlainUi from "@/index";

const app = createApp(App)
app.use(PlainUi)

app.mount('#app')
