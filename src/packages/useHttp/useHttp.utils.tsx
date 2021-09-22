export type iHttpRequestConfig = {
    url: string,
    method: any,
    query?: any
    body?: any
    headers?: any
} & Record<string, any>

export type tHttpRequest = <DATA>(config: iHttpRequestConfig) => Promise<DATA>

export type tHttp = tHttpRequest & {
    get: <DATA>(url: string, query?: any, config?: iHttpRequestConfig) => Promise<DATA>,
    post: <DATA>(url: string, body?: any, config?: iHttpRequestConfig) => Promise<DATA>,
    put: <DATA>(url: string, body?: any, config?: iHttpRequestConfig) => Promise<DATA>,
    delete: <DATA>(url: string, body?: any, config?: iHttpRequestConfig) => Promise<DATA>,
}

export interface iUseHttp {
    (): tHttp
}