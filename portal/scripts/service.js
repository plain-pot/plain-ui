import HttpService from './http'
import FileService from './file'
import FormDialog from '../components/plain-table/form/index'

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)
    const $file = new FileService(Vue)
    const $formDialog = new FormDialog(Vue)

    Object.assign(Vue.prototype, {
        $http,
        $file,
    })
    Object.assign(Vue.prototype.$plain, {
        $formDialog,
    })
}