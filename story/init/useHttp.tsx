import {iUseHttp, tHttp, tHttpRequest} from "../../src/packages/useHttp/useHttp.utils";
import {$http} from "../http/http";

const request: tHttpRequest = (config) => {
    return $http(config)
}

const http: tHttp = Object.assign(request, {
    get: (url: string, query: any, config: any) => $http.get(url, {
        ...(config || {}),
        params: query,
    }) as any,
    post: (url: string, body: any, config: any) => $http.post(url, body, config) as any,
    put: (url: string, body: any, config: any) => $http.post(url, body, config) as any,
    delete: (url: string, body: any, config: any) => $http.post(url, body, config) as any,
})

export const useHttp: iUseHttp = () => http