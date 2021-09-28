import {getInitialConfigState} from "../initialize";
import {iAddressConfig, iAddressData, iAddressService, iUseAddress} from "./useAddress.utils";
import {reactive} from "plain-design-composition";
import {debounce} from "plain-utils/utils/debounce";
import {defer} from "plain-utils/utils/defer";

export const useAddress: iUseAddress = (() => {
    const map = new WeakMap<iAddressConfig, iAddressService>()
    return () => {
        const config = getInitialConfigState('useAddressConfig')()
        let $address = map.get(config)
        if (!$address) {
            const useAddressByCodeData = useAddressByCode(config)
            const useAddressByParentCodeData = useAddressByParentCode(config, (list) => {
                list.forEach(addr => useAddressByCodeData.saveAddress(addr))
            })
            $address = {
                config: config,
                ...useAddressByCodeData,
                ...useAddressByParentCodeData,
            }
            map.set(config, $address)
        }
        return {$address: $address!}
    }
})();

function useAddressByCode(config: iAddressConfig) {

    interface AddressDefer {
        promise: Promise<iAddressData>,
        resolve: (data: iAddressData) => void,
        reject: (...args: any) => void,
    }

    const state = reactive({
        codeToAddress: {} as Record<string, iAddressData | undefined>,
        loadingMsg: '...',
    })

    setInterval(() => {
        state.loadingMsg += '.'
        state.loadingMsg.length > 6 && (state.loadingMsg = '.')
    }, 500)

    const freezeState = {
        codesToByQuery: [] as string[],
        queryPromise: {} as Record<string, AddressDefer | undefined>
    }

    const doRequest = debounce(async () => {
        const codesToBeQuery = freezeState.codesToByQuery
        freezeState.codesToByQuery = []
        try {
            const data = await config.getAddressByCodes(codesToBeQuery)
            codesToBeQuery.forEach((code) => {
                const addr = data[code] || []
                freezeState.queryPromise[code]?.resolve(addr)
                state.codeToAddress[code] = addr
            })
        } catch (e) {
            console.error(e)
            codesToBeQuery.forEach((code) => {
                freezeState.queryPromise[code]?.reject(e)
            })
        }
    }, 500)

    const addQueryLovCode = (code: string) => {freezeState.codesToByQuery.indexOf(code) === -1 && (freezeState.codesToByQuery.push(code))}

    const getAddrByCode = async (code: string): Promise<iAddressData> => {
        let addrDfd = freezeState.queryPromise[code]
        if (!addrDfd) {
            const dfd = defer<iAddressData>()
            addrDfd = freezeState.queryPromise[code] = dfd
            addQueryLovCode(code)
            doRequest()
        }
        return addrDfd.promise
    }

    const getNameByCodeComputed = (code: string): string => {
        if (state.codeToAddress[code] == null) {
            getAddrByCode(code)
            return '加载中' + state.loadingMsg
        } else {
            return state.codeToAddress[code]?.name || code
        }
    }

    const saveAddress = (addr: iAddressData) => {
        state.codeToAddress[addr.code] = addr
        freezeState.queryPromise[addr.code] = (() => {
            const dfd = defer<iAddressData>()
            dfd.resolve(addr)
            return dfd
        })()
    }

    return {
        saveAddress,
        getAddrByCode,
        getNameByCodeComputed,
    }
}

function useAddressByParentCode(config: iAddressConfig, onLoadAddrList: (addrList: iAddressData[]) => void) {

    interface AddressListDefer {
        promise: Promise<iAddressData[]>,
        resolve: (data: iAddressData[]) => void,
        reject: (...args: any) => void,
    }

    const state = reactive({
        codeToAddressList: {} as Record<string, iAddressData[] | undefined>,
        loadingMsg: '...',
    })

    setInterval(() => {
        state.loadingMsg += '.'
        state.loadingMsg.length > 6 && (state.loadingMsg = '.')
    }, 500)

    const freezeState = {
        codesToByQuery: [] as string[],
        queryPromise: {} as Record<string, AddressListDefer | undefined>
    }

    const doRequest = debounce(async () => {
        const codesToBeQuery = freezeState.codesToByQuery
        freezeState.codesToByQuery = []
        try {
            const data = await config.getAddressByParentCodes(codesToBeQuery)
            codesToBeQuery.forEach((code) => {
                const addrList = data[code] || []
                freezeState.queryPromise[code]?.resolve(addrList)
                state.codeToAddressList[code] = addrList
                onLoadAddrList(addrList)
            })
        } catch (e) {
            console.error(e)
            codesToBeQuery.forEach((code) => {
                freezeState.queryPromise[code]?.reject(e)
            })
        }
    }, 500)

    const addQueryLovCode = (code: string) => {freezeState.codesToByQuery.indexOf(code) === -1 && (freezeState.codesToByQuery.push(code))}

    const getAddressByParentCode = async (code: string): Promise<iAddressData[]> => {
        let addrDfd = freezeState.queryPromise[code]
        if (!addrDfd) {
            const dfd = defer<iAddressData[]>()
            addrDfd = freezeState.queryPromise[code] = dfd
            addQueryLovCode(code)
            doRequest()
        }
        return addrDfd.promise
    }

    return {
        getAddressByParentCode
    }
}

export default useAddress
