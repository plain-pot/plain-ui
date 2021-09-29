import {App} from 'vue'
import * as all from './entry'

const install = (app: App) => {
    Object.entries(all).forEach(([key, item]) => {
        if ('install' in item) {
            // console.log('install key', key)
            app.use(item as any)
        }
    })
}

export {install}
export * from './entry'

export default {...all, install}
