import {reactive, VueNode} from "plain-ui-composition";

import PlInput from "../PlInput";
import {FilterTextContains} from "./editor/FilterTextContains";
import PlSelect from "../PlSelect";
import {tPlc} from "../PlTable/plc/utils/plc.type";
import {tFormRuleItem} from "../PlForm/form.validate";
import PlDate from "../PlDate";
import PlDateRange from "../PlDateRange";
import PlNumberRange from "../PlNumberRange";
import {AddressQueryValueFormatter} from "../useAddress/useAddress.utils";
import {OvQueryValueFormatter} from "../useOv/useOv.utils";
import PlOv from "../PlOv";

export enum eFilterOperator {
    '=' = '=',
    '~' = '~',
    '>' = '>',
    '>=' = '>=',
    '<' = '<',
    '<=' = '<=',
    'in' = 'in',
    'not in' = 'not in',
    'in like' = 'in like',
    'not in like' = 'not in like',
    'is null' = 'is null',
    'is not null' = 'is not null',
}

export interface iFilterQuery {
    id?: string | number,
    field: string,
    operator: keyof typeof eFilterOperator | eFilterOperator,
    value?: any,
    formatValue?: (value: any) => Promise<any>,
}

export interface iFilterData {
    queries: iFilterQuery[],
    expression?: string,
}

export interface iRegistryFilterHandler {
    handlerName: string,
    render: (fto: iFilterTargetOption, emitConfirm: () => void) => VueNode,
    transform: (fto: iFilterTargetOption) => iFilterQuery | iFilterQuery[] | null,
}

export interface iRegistryFilter {
    filterName: string,
    handlers: Record<string, iRegistryFilterHandler>,
    setHandler: (handlerName: string, handler: Omit<iRegistryFilterHandler, 'handlerName'>) => iRegistryFilter,
    getHandler: (handlerName: string) => iRegistryFilterHandler | undefined
}

/**
 * 筛选配置参数对象
 * @author  韦胜健
 * @date    2021/6/17 13:56
 */
export type tFilterConfigObj = {
    defaultValue?: any,                  // 默认的筛选参数
    start?: any,                        // 范围选择绑定的起始字段
    end?: any,                          // 范围选择绑定的截止字段
    flexOrder?: number                  // form-item的flexOrder排序属性
    formColumn?: number,                // formItem的column占用列数属性
    formRule?: tFormRuleItem | tFormRuleItem[],// formItem的rule校验规则
    labelWidth?: number,                // form-item 的label宽度
} & Record<string, any>

/**
 * 筛选配置可以是个对象，也可以是个函数返回对象
 * @author  韦胜健
 * @date    2021/6/17 13:57
 */
export type tFilterConfigGetter = (filter: iFilterOption) => tFilterConfigObj
export type tFilterConfig = tFilterConfigObj | tFilterConfigGetter

export type tDefaultFilterConfig = (data: { config: tFilterConfigObj, plc: any, fo: iFilterOption }) => tFilterConfig | void
export type tDefaultFilterConfigParam = { config: tFilterConfigObj, plc: tPlc, fo: iFilterOption }

export interface iFilterOption {
    label: string,
    field: string,
    value?: any,
    filterName: string,
    handlerName: string,
    filterConfig: tFilterConfig,
    plc?: tPlc,
}

export interface iFilterTargetOption {
    filter: iRegistryFilter,
    handler: iRegistryFilterHandler,
    option: iFilterOption,
    config: tFilterConfigObj,
}

export const FilterConfig = (() => {

    const state = reactive({
        registration: {} as Record<string, iRegistryFilter | undefined>
    })

    const touchFilter = (filterName: string): iRegistryFilter => {
        if (!state.registration[filterName]) {
            state.registration[filterName] = {
                filterName,
                handlers: {},
                getHandler: handlerName => state.registration[filterName]!.handlers[handlerName],
                setHandler(handlerName, handler) {
                    this.handlers[handlerName] = {handlerName, ...handler}
                    return this
                }
            }
        }
        return state.registration[filterName]!
    }

    const getHandler = (filterName: string, handlerName: string): iRegistryFilterHandler | undefined => {
        const filter = touchFilter(filterName)
        if (!filter) {return }
        return filter.getHandler(handlerName)
    }

    const getTargetOption = (opt: iFilterOption): iFilterTargetOption | undefined => {
        const filter = touchFilter(opt.filterName)
        if (!filter) {return }
        const handler = filter.getHandler(opt.handlerName)
        if (!handler) {return }
        let config = typeof opt.filterConfig === "function" ? opt.filterConfig(opt) : opt.filterConfig
        if (!!opt.plc && !!opt.plc.props.defaultFilterConfig) {
            config = opt.plc.props.defaultFilterConfig({fo: opt, plc: opt.plc, config}) || config
        }
        return {filter, handler, option: opt, config}
    }

    const formatToQuery = (fto: iFilterTargetOption): iFilterQuery | iFilterQuery[] => {
        const {filterName, handlerName} = fto.option
        return getHandler(filterName, handlerName)!.transform(fto) || []
    }

    const hasValue = (val: any) => {
        if (val == null) {return false}
        if (typeof val === "string") {
            return !!val && !!val.trim()
        }
        if (Array.isArray(val)) {
            return val.length > 0
        }
        return true
    }

    const clearFoValue = (fo: iFilterOption) => {
        fo.value = null
        !!fo.plc && (fo.handlerName = fo.plc.props.filterHandler)
    }

    const processQueries = async (queries: iFilterQuery[]): Promise<iFilterQuery[]> => {
        return Promise.all(queries.map(async query => {
            const {formatValue, value, ...left} = query
            if (!formatValue || value == null) {
                return {value, ...left}
            } else {
                return {
                    ...left,
                    value: await formatValue(value)
                }
            }
        }))
    }

    return {
        touchFilter,
        getHandler,
        getTargetOption,
        formatToQuery,
        hasValue,
        clearFoValue,
        processQueries,
    }

})();

FilterConfig.touchFilter('text')
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["~"]})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in like"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in like"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('select')
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlSelect v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlSelect multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlSelect multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('date')
    .setHandler('范围', {
        render: (fto, emitConfirm) => {
            if (!fto.option.value) {fto.option.value = {start: null, end: null}}
            return <PlDateRange v-models={[[fto.option.value.start, 'start'], [fto.option.value.end, 'end']]} onChange={emitConfirm} datetime={fto.config.datetime}/>
        },
        transform: ({option: {value, field}}) => {
            if (!value) {return null}
            const {start, end} = value
            const queries: iFilterQuery[] = []
            if (!!start) {queries.push({field, value: start, operator: eFilterOperator[">="]})}
            if (!!end) {queries.push({field, value: end, operator: eFilterOperator["<="]})}
            return queries.length > 0 ? queries : null
        }
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlDate v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlDate multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlDate multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('number')
    .setHandler('范围', {
        render: (fto, emitConfirm) => {
            if (!fto.option.value) {fto.option.value = {start: null, end: null}}
            return <PlNumberRange v-models={[[fto.option.value.start, 'start'], [fto.option.value.end, 'end']]} onEnter={emitConfirm} onClear={emitConfirm}/>
        },
        transform: ({option: {value, field}}) => {
            if (!value) {return null}
            const {start, end} = value
            const queries: iFilterQuery[] = []
            if (!!start) {queries.push({field, value: start, operator: eFilterOperator[">="]})}
            if (!!end) {queries.push({field, value: end, operator: eFilterOperator["<="]})}
            return queries.length > 0 ? queries : null
        }
    })
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["~"]})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in like"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in like"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('address')
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}, config}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"], formatValue: AddressQueryValueFormatter.inLike(config)})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}, config}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="], formatValue: AddressQueryValueFormatter.equal(config)})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}, config}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"], formatValue: AddressQueryValueFormatter.inLike(config)})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}, config}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in"], formatValue: AddressQueryValueFormatter.inLike(config)})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('ov')
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}, config}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"], formatValue: OvQueryValueFormatter.inLike(config)})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlOv v-model={fto.option.value} ov={fto.config.ov} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlOv v-model={fto.option.value} ov={fto.config.ov} onChange={emitConfirm} multiple/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlOv v-model={fto.option.value} ov={fto.config.ov} onChange={emitConfirm} multiple/>,
        transform: ({option: {value, field}}) => !FilterConfig.hasValue(value) ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

