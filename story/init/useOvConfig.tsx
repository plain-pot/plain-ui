import {iGetOvByTypes, iGetOvByName, iOvConfig, iUseOvConfig, iOvData} from "../../src/packages/useOv/useOv.utils";
import {tHttp} from "../../src/packages/useHttp/useHttp.utils";
import {useHttp} from "./useHttp";
import {toArray} from "plain-utils/utils/toArray";

export const useOvConfig: iUseOvConfig = (() => {

    const map = new WeakMap<tHttp, iOvConfig>()

    return () => {

        const http = useHttp()
        let config = map.get(http)

        if (!config) {

            const getOvByTypes: iGetOvByTypes = async (types) => {
                const data = await http.post<{ list: iOvData[] }>('/ov/list', {
                    all: true,
                    filters: [{field: 'type', value: types, operator: 'in'}],
                })
                return data.list.reduce((prev, ov) => {
                    if (!prev[ov.type]) {prev[ov.type] = []}
                    prev[ov.type].push(ov)
                    return prev
                }, {} as Record<string, iOvData[]>)
            }

            const getOvByName: iGetOvByName = async (name) => {
                const data = await http.post<{ list: iOvData[] }>('/ov/list', {
                    all: true,
                    filters: [{field: 'name', value: toArray(name), operator: 'in like'}],
                })
                return data.list
            }

            config = {
                getOvByName,
                getOvByTypes,
            }

            map.set(http, config)
        }

        return config!
    }
})()
