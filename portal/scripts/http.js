import Axios from 'axios'
import qs from 'qs'
import deepmerge from 'deepmerge'

const env = {
    baseURL: 'http://localhost:8989/',
}

const axios = Axios.create({
    baseURL: env.baseURL,
    timeout: 30 * 1000,
})

export default class HttpService {

    Vue;

    constructor(Vue) {
        this.Vue = Vue
    }

    async get(url, data, config) {
        return this.request(url, data, config, 'get')
    }

    async post(url, data, config) {
        return this.request(url, data, config, 'post')
    }

    async request(url, data, config, method) {
        data = data || {}
        config = config || {}
        method = method || 'post'
        config = deepmerge({
            autoValidResp: true,
            axios: {},
            formRequest: false,
        }, config)

        if (config.formRequest) data = qs.stringify(data)

        return new Promise((rs, rj) => {
            axios({
                method,
                url,
                data,
                headers: {'Content-Type': config.formRequest ? 'application/x-www-form-urlencoded' : 'application/json'},
                ...config.axios,
            }).then((resp) => {
                const data = resp.data
                if (!config.autoValidResp || data.code === 0) {
                    rs(resp.data, resp)
                } else {
                    throw '系统异常！' + data.ret
                }
            }).catch((e) => {
                this.Vue.prototype.$dialog.show(JSON.stringify(e), {title: '网络异常！', type: 'error'})
                rj(e)
                console.dir(e)
            })
        })
    }

    async axios(...args) {
        return await axios(...args)
    }

}
