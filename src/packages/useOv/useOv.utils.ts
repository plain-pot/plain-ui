import {tFilterConfigObj} from "../PlFilter/FilterConfig";

export interface iOvData {
    id: string,
    code: string,
    name: string,
    type: string,
    comment: string,
}

export interface iGetOvByTypes {
    (types: string[]): Promise<Record<string, iOvData[]>>
}

export interface iGetOvByName {
    (name: string | string[]): Promise<iOvData[]>
}

export interface iOvConfig {
    getOvByTypes: iGetOvByTypes,
    getOvByName: iGetOvByName,
}

export interface iUseOvConfig {
    (): iOvConfig
}

export interface iOvService {
    getOvByType: (type: string) => Promise<iOvData[]>,
    getNameByTypeAndCodeComputed: (type: string, code: string) => string,
    config: iOvConfig
}

export interface iUseOv {
    (): { $ov: iOvService }
}

export const OvQueryValueFormatter = {
    equal: (config: tFilterConfigObj) => {
        return async (value: any) => {
            const $ov = config.$ov as iOvService
            const ovList = await $ov.config.getOvByName(value)
            return ovList.find(i => i.name == value)?.code || '__not found!__'
        }
    },
    inLike: (config: tFilterConfigObj) => {
        return async (value: any) => {
            const $ov = config.$ov as iOvService
            const ovList = await $ov.config.getOvByName(value)
            return ovList.length === 0 ? ['__not found!__'] : ovList.map(i => i.code)
        }
    },
}
