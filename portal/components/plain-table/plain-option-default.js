/**
 * 默认查询地址后缀
 * @author  韦胜健
 * @date    2019/6/20 14:17
 */
export const DEFAULT_URLS = {
    queryPage: 'queryPage',
    queryCount: 'queryCount',
    insert: 'insert',
    update: 'update',
    delete: 'delete',
    batchInsert: 'batchInsert',
    batchUpdate: 'batchUpdate',
    batchDelete: 'batchDelete',
    exp: 'exp',
    imp: 'imp',
}

/**
 * 默认公共的option
 * @author  韦胜健
 * @date    2019/6/20 14:18
 */
export const DEFAULT_OPTION_PUBLIC = {
    list: [],
    showNum: 10,
    headRowHeight: 40,
    sortField: 'id',
    sortDesc: true,
    pageSize: 10,
    pageOption: [5, 10, 20, 50, 100],
}

/**
 * PlainTable的默认参数
 *
 * @author  韦胜健
 * @date    2019/6/20 14:19
 */
export const DEFAULT_OPTION_PLAIN_TABLE = {
    loadOnStart: true,
    bodyRowHeight: 36,
}

/**
 * PlainTableService的默认参数
 * @author  韦胜健
 * @date    2019/6/20 14:19
 */
export const DEFAULT_OPTION_PLAIN_TABLE_SERVICE = {
    bodyRowHeight: 28,
}

/**
 * 打印option时，忽略的字段
 * @author  韦胜健
 * @date    2019/6/20 14:42
 */
export const ignore_attrs = [
    '$attrs', '$children', '$createElement', '$listeners', '$options', '$parent', '$refs', '$root', '$scopedSlots', '$slots', '$vnode', '_c',
    '_computedWatchers', '_data', '_directInactive', '_events', '_hasHookEvent', '_inactive', '_isBeingDestroyed', '_isDestroyed', '_isMounted', '_isVue', '_renderProxy',
    '_self', '_staticTrees', '_uid', '_vnode', '_watcher', '_watchers'
]

/**
 * 打印option信息
 * @author  韦胜健
 * @date    2019/6/20 14:44
 */
export function logOption(option) {
    if (!option) return
    console.log(Object.keys(option).reduce((ret, key) => {
        if (ignore_attrs.indexOf(key) === -1) ret[key] = option[key]
        return ret
    }, {}))
}