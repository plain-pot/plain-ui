import Axios, {AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse} from 'axios'
import {env} from "../env";
import {PlainObject} from "../../src/packages/createUseTableOption/createUseTableOption.utils";

export type StandardResp<T> = Promise<T & { _resp: AxiosResponse<T> }>

export interface AxiosInstance {
    <T = PlainObject>(config: AxiosRequestConfig): StandardResp<T>;

    <T = PlainObject>(url: string, config?: AxiosRequestConfig): StandardResp<T>;

    defaults: AxiosRequestConfig;
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    };

    getUri(config?: AxiosRequestConfig): string;

    request<T = PlainObject>(config: AxiosRequestConfig): StandardResp<T>;

    get<T = PlainObject>(url: string, config?: AxiosRequestConfig): StandardResp<T>;

    delete<T = PlainObject>(url: string, config?: AxiosRequestConfig): StandardResp<T>;

    head<T = PlainObject>(url: string, config?: AxiosRequestConfig): StandardResp<T>;

    options<T = PlainObject>(url: string, config?: AxiosRequestConfig): StandardResp<T>;

    post<T = PlainObject>(url: string, data?: any, config?: AxiosRequestConfig): StandardResp<T>;

    put<T = PlainObject>(url: string, data?: any, config?: AxiosRequestConfig): StandardResp<T>;

    patch<T = PlainObject>(url: string, data?: any, config?: AxiosRequestConfig): StandardResp<T>;
}

export const $http = (() => {
    const axios = Axios.create({
        baseURL: env.base,
    })
    axios.interceptors.response.use((resp) => {
        if ([404, 500, 403].indexOf(resp.status) > -1) {
            return resp
        } else {
            const {data} = resp
            return Object.assign(data, {_resp: resp})
        }
    })
    return axios as AxiosInstance
})();
