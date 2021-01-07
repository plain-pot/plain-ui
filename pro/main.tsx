import {createApp} from 'vue'
import App from './app.vue'
import PlainUi from "../src/index";

/* eslint-disable */

function designMainApplication(init: () => void) {
    if (!(window as any).HAS_MAIN_APPLICATION) {
        /*
        *  当前访问主应用运行，主应用自己初始化
        */
        (window as any).HAS_MAIN_APPLICATION = 'MAIN_APPLICATION'
        init();
    }
    return (config: { assetPublicPath: string }) => {
        /*
        *  否则为子应用运行，子应用通过加载主应用之后初始化
        */
        __webpack_public_path__ = config.assetPublicPath
        init()
    }
}

/*---------------------------------------start-------------------------------------------*/

export default designMainApplication(() => {
    const app = createApp(App)
    app.use(PlainUi)
    app.mount('#app')
})

/* eslint-enable */