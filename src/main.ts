import {createApp} from 'vue'
import App from './App.vue'
import {installPackage} from "@/packages/index";

const app = createApp(App)
installPackage(app)

app.mount('#app')
