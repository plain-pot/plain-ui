import {iOvConfig, iOvData, iOvService, iUseOv} from "./useOv.utils";
import {getInitialConfigState} from "../initialize";
import {reactive} from "plain-design-composition";
import {debounce} from "plain-utils/utils/debounce";
import {defer} from "plain-utils/utils/defer";

export const useOv: iUseOv = (() => {

    const map = new WeakMap<iOvConfig, iOvService>()

    return () => {
        const config = getInitialConfigState("useOvConfig")()
        let service = map.get(config)

        if (!service) {

            interface OvDefer {
                promise: Promise<iOvData[]>,
                resolve: (data: iOvData[]) => void,
                reject: (...args: any) => void,
            }

            const state = reactive({
                typeToOvList: {} as Record<string, iOvData[] | undefined>,
                loadingMsg: '...',
            })

            setInterval(() => {
                state.loadingMsg += '.'
                state.loadingMsg.length > 6 && (state.loadingMsg = '.')
            }, 500)

            const freezeState = {
                typesToByQuery: [] as string[],
                queryPromise: {} as Record<string, OvDefer | undefined>
            }

            const doRequest = debounce(async () => {
                const typesToByQuery = freezeState.typesToByQuery
                freezeState.typesToByQuery = []
                try {
                    const data = await config.getOvByTypes(typesToByQuery)
                    typesToByQuery.forEach((type) => {
                        const ovList = data[type] || []
                        freezeState.queryPromise[type]?.resolve(ovList)
                        state.typeToOvList[type] = ovList
                    })
                } catch (e) {
                    console.error(e)
                    typesToByQuery.forEach((code) => {
                        freezeState.queryPromise[code]?.reject(e)
                    })
                }
            }, 500)

            const addQueryLovCode = (code: string) => {freezeState.typesToByQuery.indexOf(code) === -1 && (freezeState.typesToByQuery.push(code))}

            const getOvByType: iOvService["getOvByType"] = (type) => {
                let ovDfd = freezeState.queryPromise[type]
                if (!ovDfd) {
                    const dfd = defer<iOvData[]>()
                    ovDfd = freezeState.queryPromise[type] = dfd
                    addQueryLovCode(type)
                    doRequest()
                }
                return ovDfd.promise
            }

            const getNameByTypeAndCodeComputed: iOvService["getNameByTypeAndCodeComputed"] = (type, code) => {
                if (state.typeToOvList[type] == null) {
                    getOvByType(type)
                    return '加载中' + state.loadingMsg
                } else {
                    return state.typeToOvList[type]?.find(i => i.code == code)?.name || ''
                }
            }

            service = {
                getOvByType,
                getNameByTypeAndCodeComputed,
                config,
            }

            map.set(config, service)
        }

        return {$ov: service!}
    }

})()

export default useOv
