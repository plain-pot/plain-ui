import {$http} from "../http/http";
import {tDeleteResponse, tUrlConfig} from "../../src/packages/createUseTableOption/createUseTableOption.utils";
import {eFilterOperator} from "../../src/packages/PlFilter/FilterConfig";
import {iTableOptionCacheData} from "../../src/packages/createUseTableOption/use/use.cache.utils";
import {createCounter} from "plain-utils/utils/createCounter";
import createUseTableOption from "../../src/packages/createUseTableOption";
import $$notice from "../../src/packages/$$notice";

const generateFilterId = createCounter('auto_filter_id')

interface iModuleQueryFilter {
    id?: string | number,
    field: string,
    operator: keyof typeof eFilterOperator | eFilterOperator,
    value?: any,
}

const useTableOption = createUseTableOption({
    keyField: 'id',
    bodyRowHeight: 48,
    headRowHeight: 48,
    border: false,
    defaultShowRow: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    editType: 'inline',
    copyDefaultExcludeKeys: ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
    sort: {field: 'updatedAt', desc: true},
    hideButton: {},
    ...(() => {
        const STORAGE_KEY = '@@TABLE_PRO_CACHE'
        const str = window.localStorage.getItem(STORAGE_KEY)
        const totalCacheData = !str ? {} : JSON.parse(str)

        const getCache = (key: string): iTableOptionCacheData => {
            return totalCacheData[key + window.location.hash]
        }
        const setCache = (cacheData: iTableOptionCacheData) => {
            totalCacheData[cacheData.tableId + window.location.hash] = cacheData
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(totalCacheData))
        }
        return {getCache, setCache}
    })(),
    getDefaultUrlConfig: {
        query: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = `${base}/list`}
            if (!method) {method = 'POST'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            rows: data.list,
                            hasNext: data.hasNext,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '查询失败！', message: Object.prototype.toString.call(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        insert: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = base}
            if (!method) {method = 'POST'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRow: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '新建失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        update: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = base}
            if (!method) {method = 'PUT'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRow: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '更新失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        batchInsert: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = `${base}/batch`}
            if (!method) {method = 'POST'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRows: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '批量新建失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        batchUpdate: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = `${base}/batch`}
            if (!method) {method = 'PUT'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRows: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '批量更新失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        ...(() => {
            const getter = (config: tUrlConfig<tDeleteResponse>) => {
                let {url, base, method, request, ...left} = config
                if (!url && !!base) {url = base}
                if (!method) {method = 'DELETE'}
                if (!request) {
                    request = async (requestConfig) => {
                        try {
                            const {query, body, ...config} = requestConfig
                            const data = await $http({
                                ...config,
                                params: query,
                                data: body,
                            })
                            return {error: data.message}
                        } catch (e) {
                            $$notice.error({title: '删除失败！', message: String(e)})
                            throw e
                        }
                    }
                }
                return {...left, url: url!, method, request,}
            }
            return {
                delete: getter,
                batchDelete: getter,
            }
        })(),
    },
    injectRules: (filterDataArr, requestConfig) => {
        const hasCustomExpression = filterDataArr.some(i => !!i.expression && i.expression.trim().length > 0)
        const requestData = requestConfig.method === 'GET' ? requestConfig.query : requestConfig.body

        if (hasCustomExpression) {
            const expressions: string[] = []
            const filters: iModuleQueryFilter[] = []
            filterDataArr.forEach(({expression, queries}) => {
                if (queries.length === 0) {return}
                if (!expression) {
                    expression = queries.map((query) => {
                        if (!query.id) {query.id = generateFilterId()}
                        return query.id
                    }).join(' and ')
                }
                expressions.push(expression)
                filters.push(...queries)
            })

            filters.length > 0 && Object.assign(requestData, {
                filters, filterExpression: expressions.map(i => `(${i})`).join(' and ')
            })
        } else {
            const filters: iModuleQueryFilter[] = filterDataArr.map(i => i.queries).flat()
            filters.length > 0 && Object.assign(requestData, {filters})
        }
    }
})

export default useTableOption
