import HttpService from './http'
import FileService from './file'

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)
    const $file = new FileService(Vue)

    Object.assign(Vue.prototype, {
        $http,
        $file,
    })
}