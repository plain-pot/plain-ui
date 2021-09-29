import PlTable from "../PlTable";
import {tFormPropRules} from "../PlForm/form.validate";
import {iFilterData} from "../PlFilter/FilterConfig";
import {tTableOptionConfigHook} from "./use/use.hooks";
import {TableNode} from "../PlTable/table/use/useTableNode";
import {iTableOptionCacheData} from "./use/use.cache.utils";
import {VueNode} from "plain-design-composition";

/*普通对象类型*/
export type PlainObject = Record<string, any>;

/*默认新建行数据类型*/
export type tDefaultNewRowObject = PlainObject
export type tDefaultNewRowGetter = () => tDefaultNewRowObject | Promise<tDefaultNewRowObject>
export type tDefaultNewRow = tDefaultNewRowObject | tDefaultNewRowGetter

/*请求相关类型*/
export type tRequestConfigMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
export type tRequestConfig = {
    method: tRequestConfigMethod,
    url: string,
    query?: PlainObject,
    body?: PlainObject,
    headers?: PlainObject,
} & Record<string, any>;

/*tableOptionConfig中url的类型*/
export type tUrlConfig<RequestResp> = {
    base?: string,
    url?: string,
    method?: tRequestConfigMethod,
    query?: PlainObject,
    body?: PlainObject,
    request?: (requestConfig: tRequestConfig) => Promise<RequestResp>;
}

/**
 * tUrlConfig格式化之后得到的对象
 * @author  韦胜健
 * @date    2021/5/19 21:07
 */
export type tUrlConfigFormat<RequestResp> = {
    url: string,
    method: tRequestConfigMethod,
    request: (requestConfig: tRequestConfig) => Promise<RequestResp>;
    query?: PlainObject,
    body?: PlainObject,
} & PlainObject

/**
 * 基础请求路径：
 * url:string = url.base:string
 * - 分页查询会使用这个路径，通过GET方法请求数据；
 * - 新建会根据这个路径，通过POST方法请求；
 * - 更新会根据这个路径，通过PUT方法请求；
 * - 删除会根据这个路径，通过DELETE方法请求；
 *
 * @author  韦胜健
 * @date    2021/4/27 17:03
 */
export type tUrl = string | {
    base?: string,
    query?: string | tUrlConfig<iQueryResponse>,

    insert?: string | tUrlConfig<tInsertResponse>,
    batchInsert?: string | tUrlConfig<tBatchInsertResponse>,

    update?: string | tUrlConfig<tUpdateResponse>,
    batchUpdate?: string | tUrlConfig<tBatchUpdateResponse>,

    delete?: string | tUrlConfig<tDeleteResponse>,
    batchDelete?: string | tUrlConfig<tDeleteResponse>,
}

export interface iQueryResponse {
    rows: any[],
    hasNext: boolean,
    total?: number | null,
}

export type tInsertResponse = { newRow: PlainObject } & Record<string, any>
export type tBatchInsertResponse = { newRows: PlainObject[] } & Record<string, any>
export type tUpdateResponse = tInsertResponse
export type tBatchUpdateResponse = tBatchInsertResponse
export type tDeleteResponse = { error?: string }

/**
 * 排序设置参数对象(用来查询的排序参数结构)
 * @author  韦胜健
 * @date    2021/6/7 17:15
 */
export interface iTableSortData {
    field: string,
    desc: boolean
}

export enum eTableProEditType {
    inline = 'inline',
    form = 'form'
}

/*---------------------------------------button start-------------------------------------------*/

export interface iTableOptionButtonBase {
    type: 'insert' | 'update' | 'delete' | 'other',
    code: string,
    seq?: number,
}

export type iTableOptionButtonInner = iTableOptionButtonBase & {
    position: 'in',
    handler?: (selectNode: TableNode, e: MouseEvent) => void,
    render?: (selectNode: TableNode) => VueNode,
    label: string | ((selectNode: TableNode) => string),
    icon?: string | ((selectNode: TableNode) => string),
    show?: boolean | ((selectNode: TableNode) => boolean),
    disabled?: boolean | ((selectNode: TableNode) => boolean),
}

export type iTableOptionButtonOuter = iTableOptionButtonBase & {
    position: 'out' | 'more',
    handler?: (e: MouseEvent | KeyboardEvent) => void,
    render?: () => VueNode,
    label: string | (() => string),
    icon?: string | (() => string),
    show?: boolean | (() => boolean),
    disabled?: boolean | (() => boolean),

    command?: string | string[],
}

export type iTableOptionButton = iTableOptionButtonInner | iTableOptionButtonOuter

/*---------------------------------------button end-------------------------------------------*/

/**
 * TablePro默认配置
 * @author  韦胜健
 * @date    2021/5/19 20:51
 */
export interface iTableProDefaultConfig {
    keyField: string,                                                   // 行数据唯一标识字段名称
    bodyRowHeight: number,                                              // 行高
    headRowHeight: number,                                              // 表头行高
    indexing?: boolean,                                                 // 是否需要索引列
    border?: boolean,                                                   // 是否显示单元格边框
    defaultShowRow: number,                                             // 当没有设置showRow，也没有设置自动填充高度时，默认的显示行数
    pageSizeOptions: number[],                                          // 也大小选项数组
    editType: keyof typeof eTableProEditType,                           // 编辑类型，inline或者form
    loadOnStart?: boolean,                                              // 是否页面初始化的时候就加载数据
    copyDefaultExcludeKeys: string[],                                   // 复制一行的时候，不复制的属性
    injectRules: (filterDataArr: iFilterData[], requestConfig: tRequestConfig) => void | tRequestConfig, // 将筛选条件rules填写到requestConfig中
    sort: iTableSortData | iTableSortData[],                            // 排序方式
    hideButton: Record<string, boolean | undefined>,                    // 隐藏某个按钮
    getCache: (key: string) => iTableOptionCacheData | undefined,       // 获取缓存配置信息
    setCache: (cacheData: iTableOptionCacheData) => void,               // 保存缓存配置信息
    getDefaultUrlConfig: {
        query: (data: tUrlConfig<iQueryResponse>) => tUrlConfigFormat<iQueryResponse>,
        insert: (data: tUrlConfig<tInsertResponse>) => tUrlConfigFormat<tInsertResponse>,
        batchInsert: (data: tUrlConfig<tBatchInsertResponse>) => tUrlConfigFormat<tBatchInsertResponse>,
        update: (data: tUrlConfig<tUpdateResponse>) => tUrlConfigFormat<tUpdateResponse>,
        batchUpdate: (data: tUrlConfig<tBatchUpdateResponse>) => tUrlConfigFormat<tBatchUpdateResponse>,
        delete: (data: tUrlConfig<tDeleteResponse>) => tUrlConfigFormat<tDeleteResponse>,
        batchDelete: (data: tUrlConfig<tDeleteResponse>) => tUrlConfigFormat<tDeleteResponse>,
    },
}

export type iQueryRequest = ReturnType<iTableProDefaultConfig["getDefaultUrlConfig"]["query"]>["request"]

export type TableProConfigEnable = boolean | {
    insert?: boolean | (() => boolean),                             // 是否可新建
    update?: boolean | (() => boolean),                             // 是否可编辑
    delete?: boolean | (() => boolean),                             // 是否可删除
}

/**
 * TablePro配置信息
 * @author  韦胜健
 * @date    2021/5/19 20:51
 */
export interface iTableProConfig<D = any> extends Partial<iTableProDefaultConfig> {
    data?: D[],                                                         // 当前数据
    url?: tUrl,                                                         // 请求地址信息
    fill?: boolean,                                                     // 是否自动计算高度
    showRows?: number,                                                   // 显示的行数（自动计算表格的高度）
    queryParams?: PlainObject | Promise<PlainObject> | (() => PlainObject | Promise<PlainObject>)//查询参数
    pageSize?: number,                                                  // 请求页大小
    editType?: keyof typeof eTableProEditType,                          // 编辑类型
    defaultEditing?: boolean,                                           // <是否默认开启编辑状态>
    defaultNewRow?: tDefaultNewRow,                                     // 新建行的时候的默认新行数据
    copyExcludeKeys?: string[],                                         // 复制一行的时候，额外的不复制的属性
    rules?: tFormPropRules,                                             // 校验规则
    buttons?: iTableOptionButton[],                                     // 额外的按钮配置
    multipleCheck?: boolean,                                            // 是否显示多选列
    title?: string,                                                     // 标题
    render?: () => VueNode,                                           // 自定义内容
    isCheckable?: (row: any) => boolean,                                // 某条记录是否可以被选中
    sort?: iTableSortData | iTableSortData[],                           // 排序方式
    filterParam?: iFilterData | iFilterData[] | (() => iFilterData | iFilterData[] | null | undefined | Promise<iFilterData | iFilterData[] | null | undefined>),// 筛选参数
    hooks?: tTableOptionConfigHook,                                     // 监听钩子函数
    enable?: TableProConfigEnable,                                      // 新删改查控制
    hideOperation?: boolean,                                            // 是否隐藏操作栏
    parentOption?: Record<string, any>,                                 // 父表的option
    parentMap?: Record<string, any>,                                    // 父表的字段映射（）
}

export type tTableOptionConfig = iTableProDefaultConfig & iTableProConfig

export interface iTableOptionState {
    list: any[],
    editingWhenAddRow: boolean,
    selectRows: any[],
    currentKey: string | number | null,
    tableGetter: () => typeof PlTable.use.class | null,
}
