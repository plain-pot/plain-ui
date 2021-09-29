import {App} from 'vue'
import * as all from './entry'

const install = (app: App) => {
    Object.values(all).forEach(item => {
        if ('install' in item) {
            app.use(item as any)
        }
    })
}

export {install}
export * from './entry'

export default {...all, install}
