import HttpService from './http'

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)

    Object.assign(Vue.prototype, {
        $http,
    })
}