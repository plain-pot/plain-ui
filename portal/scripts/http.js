import Axios from 'axios'
import qs from 'qs'
import deepmerge from 'deepmerge'
import getEnv from '../env'

let env = null
let axios = null

async function getAxios() {
    if (!axios) {
        env = await getEnv()

        axios = Axios.create({
            baseURL: env.server,
            timeout: 30 * 1000,
        })
    }
    return axios
}

export default class HttpService {

    Vue;

    constructor(Vue) {
        this.Vue = Vue
    }

    getEnv = getEnv

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

        return new Promise(async (rs, rj) => {
            (await getAxios())({
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
        return await axios(...args).catch(e => {
            this.Vue.prototype.$dialog.show(JSON.stringify('系统异常：' + e.message), {title: '网络异常！', type: 'error'})
        })
    }

}
