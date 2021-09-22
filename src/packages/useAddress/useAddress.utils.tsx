import {tFilterConfigObj} from "../PlFilter/FilterConfig";

export interface iAddressData {
    id: string,
    code: string,
    name: string,
    parentCode: string,
    parentName: string,
    deep: number,
}

export interface iGetAddressByCodes {
    (codes: string[]): Promise<Record<string, iAddressData>>
}

export interface iGetAddressByParentCodes {
    (codes: string[]): Promise<Record<string, iAddressData[]>>
}

export interface iGetAddressByName {
    (name: string, deep?: number): Promise<iAddressData[]>
}

export interface iAddressConfig {
    getAddressByCodes: iGetAddressByCodes,
    getAddressByParentCodes: iGetAddressByParentCodes,
    getAddressByName: iGetAddressByName,
}

export interface iUseAddressConfig {
    (): iAddressConfig
}

export interface iAddressService {
    getAddrByCode: (code: string) => Promise<iAddressData>,
    getNameByCodeComputed: (code: string) => string,
    getAddressByParentCode: (code: string) => Promise<iAddressData[]>,
    config: iAddressConfig,
}

export interface iUseAddress {
    (): { $address: iAddressService }
}

export const AddressQueryValueFormatter = {
    equal: (config: tFilterConfigObj) => {
        return async (value: any) => {
            const $address = config.$address as iAddressService
            const addrList = await $address.config.getAddressByName(value, config.province ? 0 : config.city ? 1 : 2)
            return addrList.find(i => i.name == value)?.code || 'not found!'
        }
    },
    inLike: (config: tFilterConfigObj) => {
        return async (value: any) => {
            const $address = config.$address as iAddressService
            const addrList = await $address.config.getAddressByName(value, config.province ? 0 : config.city ? 1 : 2)
            return addrList.length === 0 ? ['not found'] : addrList.map(i => i.code)
        }
    },
}
