import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";

export interface iTableOptionCacheItemData {
    id: number,
    title: string,
    time: string,
    data: Record<string, any>,
}

export interface iTableOptionCacheData {
    tableId: string,
    activeId: number | undefined,
    data: iTableOptionCacheItemData[],
}

export interface iTableOptionApplyCacheParam<CacheData> {
    plcList: tPlc[],
    cacheData: CacheData | undefined
    sourceList: tPlcType[],
}

export interface iTableOptionGetCacheParam {
    plcList: tPlc[],
    sourceList: tPlcType[],
}

export interface iTableOptionCacheRegistryConfig<CacheData = any> {
    cacheKey: string,
    applyCache: (param: iTableOptionApplyCacheParam<CacheData>) => void,
    getCache: (param: iTableOptionGetCacheParam) => CacheData,
}

export const getTableId = (plcTypeList: tPlcType[]): string => {
    return plcTypeList.map(i => {
        if (i.group) {
            return `${i.props.title || '#'}-${getTableId(i.children)}`
        } else {
            return `${i.props.title || '#'}-${i.props.field || '@'}`
        }
    }).join('_')
}
