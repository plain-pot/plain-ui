import {eTableProEditType, iTableProDefaultConfig, iTableSortData, iTableOptionState, tTableOptionConfig, tUrlConfig} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableOptionHooks} from "./use.hooks";
import $$notice from "../../$$notice";
import PlTable from "../../PlTable";
import $$message from "../../$$message";
import {deepcopy} from "plain-utils/object/deepcopy";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {$$dialog} from "../../useDialog";
import {useAsyncMethods} from "../utils/useAsyncMethods";
import {useTableOptionEditForm} from "./use.edit-form";
import {tTableOptionCheck} from "./check/use.check";
import {eTableProStatus, tTableOptionConfirm} from "./use.confirm";
import {useTableOptionModifyForm} from "./use.modify-form";
import {delay} from "plain-utils/utils/delay";
import {FilterConfig} from "../../PlFilter/FilterConfig";
import {nextTick} from "plain-design-composition";

export function useTableOptionMethods({tableState, config, pagination, hooks, currentNode, check, confirm, getSortData}: {
    tableState: iTableOptionState,
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableOptionHooks,
    currentNode: { value: TableNode | null | undefined },
    check: tTableOptionCheck,
    confirm: tTableOptionConfirm,
    getSortData: () => iTableSortData[],
}) {

    const freezeState = {
        table: {} as typeof PlTable.use.class
    }

    const tableOptionEditForm = useTableOptionEditForm()
    const tableOptionModifyForm = useTableOptionModifyForm()

    const utils = {
        getUrlConfig: <T extends keyof iTableProDefaultConfig["getDefaultUrlConfig"]>(type: T) => {
            const urlConfig: tUrlConfig<any> = (() => {
                if (!config.url) {throw new Error('option.config.url 不能为空！')}
                if (typeof config.url === "string") {
                    return {base: config.url}
                } else {
                    const base = config.url.base
                    const urlConfig = config.url[type]
                    return typeof urlConfig === "string" ? {url: urlConfig} : {...urlConfig as any, base}
                }
            })();
            let {request, ...requestConfig} = config.getDefaultUrlConfig[type]!(urlConfig)
            const requestData: any = (() => {
                const dataName = requestConfig.method === 'GET' ? 'query' : 'body'
                if (!requestConfig[dataName]) {requestConfig[dataName] = {}}
                return requestConfig[dataName]
            })();
            return {
                /*用来发送请求的request函数*/
                request: request as any as ReturnType<iTableProDefaultConfig["getDefaultUrlConfig"][T]>["request"],
                /*请求参数，如果是GET请求，则为config.query，否则为config.body*/
                requestData,
                /*请求配置对象*/
                requestConfig,
            }
        },
    }

    const pageMethods = useAsyncMethods((() => {

        const load = async (loadConfig?: { page?: number, size?: number }) => {
            if (confirm.state.status !== eTableProStatus.select) {await editMethods.save()}
            await hooks.onBeginLoad.exec(undefined)
            let targetLoadConfig = {
                page: !!loadConfig && loadConfig.page != null ? loadConfig.page : pagination.pageState.page,
                size: !!loadConfig && loadConfig.size != null ? loadConfig.size : pagination.pageState.size,
                orders: [] as { field: string, desc: boolean }[],
            }
            targetLoadConfig.orders = getSortData().map(({field, desc}) => ({field, desc}))

            let {request, requestData, requestConfig} = utils.getUrlConfig('query')

            const queryParams = await hooks.onQueryParams.exec(!config.queryParams ? {} : (deepcopy(typeof config.queryParams === "function" ? (await config.queryParams()) : (await config.queryParams))))
            Object.assign(requestData, queryParams)

            Object.assign(requestData, targetLoadConfig)
            let filterDaraArr = await hooks.onCollectFilterData.exec([])
            filterDaraArr = await Promise.all(filterDaraArr.map(async filterData => ({...filterData, queries: await FilterConfig.processQueries(filterData.queries),})))
            requestConfig = config.injectRules(filterDaraArr, requestConfig) || requestConfig
            const newRequestData = await hooks.onRequestData.exec(requestData)
            if (newRequestData !== requestData) {
                requestData = newRequestData
                requestConfig.method === 'GET' ? (requestConfig.query = requestData) : (requestConfig.body = requestData)
            }
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            await hooks.onStartLoad.exec({requestConfig, requestData, request})
            let {rows, hasNext} = await request(requestConfig)
            rows = await Promise.all(rows.map(row => hooks.onFormatRow.exec(row)))
            rows = await hooks.onAfterLoad.exec(rows)
            rows = await hooks.onLoaded.exec(rows)
            pagination.update({...targetLoadConfig, hasNext, list: rows})
            return rows
        }

        const reload = async (reloadConfig?: { size?: number }) => {
            const rows = await load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
            pagination.updateTotal(null)
            return rows
        }

        const queryCount = async () => {
            if (confirm.state.status !== eTableProStatus.select) {await editMethods.save()}
            await hooks.onBeginLoad.exec(undefined)
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, {onlyCount: true})
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {total} = await request(requestConfig)
            pagination.updateTotal(total || null)
            return total
        }

        const next = async () => {
            const {page, hasNext} = pagination.pageState
            if (!hasNext) {return}
            return load({page: page + 1})
        }

        const prev = async () => {
            let page = pagination.pageState.page - 1
            if (page < 0) {return}
            return load({page})
        }

        const jump = async (page: number) => {
            if (page < 0) {return}
            if (page > pagination.pageState.page) {
                if (page === pagination.pageState.page + 1 && pagination.pageState.hasNext) {
                    return load({page})
                } else {
                    const total = await queryCount()
                    if (!total) {
                        const msg = '查询总数失败！'
                        $$notice.error(msg)
                        throw new Error(msg)
                    }
                    const totalPage = Math.ceil(total / pagination.pageState.size) - 1
                    if (page > totalPage) {page = totalPage}
                    return load({page})
                }
            } else {
                return load({page})
            }
        }

        return {load, reload, queryCount, next, prev, jump,}
    })())

    const editMethods = (() => {
        const loadingMethods = useAsyncMethods((() => {

            const cancel = async () => {await confirm.close.cancel()}
            const save = async () => {await confirm.close.confirm()}

            const _delete = async (node?: TableNode | null) => {
                await loadingMethods.save()
                node = node || currentNode.value
                if (!node) {
                    return $$notice.warn('请选中一行要删除的数据！')
                }
                const {page, size} = pagination.pageState
                const {data, index} = node
                await $$dialog.confirm(`确定要删除第${page * size + index + 1}条数据吗？`)

                let {request, requestConfig} = utils.getUrlConfig('delete')
                requestConfig.body = deepcopy(data)
                requestConfig = await hooks.onBeforeDelete.exec(requestConfig)
                const deleteResult = await request!(requestConfig)
                if (!!deleteResult.error) {
                    return $$notice.error(`删除失败：${deleteResult.error}`)
                }
                await pageMethods.load()
            }

            return {save, cancel, delete: _delete}
        })())

        const selectCurrent = async (key: string) => {
            tableState.currentKey = key
            await delay(0)
            await hooks.onSelectChange.exec(currentNode.value)
        }

        const saveInsert = async (editRow: any) => {
            let {request, requestConfig} = utils.getUrlConfig('insert')
            const saveRowPrev = await hooks.onBeforeSaveRow.exec(editRow)
            requestConfig.body = {row: deepcopy(saveRowPrev)}
            requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
            const newRowResult = await request!(requestConfig)
            let saveRowNext = await hooks.onAfterSaveRow.exec(newRowResult.newRow)
            saveRowNext = await hooks.onFormatRow.exec(saveRowNext)
            return saveRowNext
        }

        const insert = async (newRow?: Record<string, any>, editType?: eTableProEditType) => {
            await loadingMethods.save()
            let newRowData = deepcopy(newRow || (!config.defaultNewRow ? {} : (typeof config.defaultNewRow === "function" ? config.defaultNewRow() : config.defaultNewRow)))
            newRowData = await hooks.onHandleNewRow.exec(newRowData)

            const editInline = async () => {
                tableState.editingWhenAddRow = true
                tableState.list.unshift(newRowData)
                await nextTick()
                const newNode = freezeState.table.flatNodes.value[0]
                newNode.validate()
                tableState.editingWhenAddRow = false

                confirm.open(eTableProStatus.insert, {
                    onConfirm: async () => {
                        const validateResult = await newNode.validate()
                        if (!!validateResult) {
                            const {errors, node: {index}} = validateResult
                            $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                            return Promise.reject(validateResult)
                        }
                        const saveRow = await saveInsert(newNode.editRow)
                        newNode.saveEdit(saveRow)
                        newNode.closeEdit()
                        await selectCurrent(saveRow[config.keyField])
                    },
                    onCancel: async () => {
                        tableState.list.shift()
                        await selectCurrent(!tableState.list[0] ? undefined : tableState.list[0][config.keyField])
                    },
                })
            }
            const editForm = () => {
                const newNode = freezeState.table.utils.getTreeNodeByData({
                    data: newRowData,
                    level: 1,
                    parentRef: () => null as any,
                })
                tableOptionEditForm.edit({
                    node: newNode,
                    title: '新建',
                    plcList: freezeState.table.plcData.value!.sourceFlatPlcList,
                    onConfirm: async (newNode) => {
                        const saveRow = await saveInsert(newNode.editRow)
                        tableState.list.unshift(saveRow)
                        await selectCurrent(saveRow[config.keyField])
                    },
                })
            }

            await ((editType || config.editType) === eTableProEditType.inline ? editInline() : editForm())
        }

        const batchInsert = async (batchInsertConfig?: { rows: any[] }) => {
            await loadingMethods.save()

            let newRows = batchInsertConfig?.rows || await (async () => {
                const num = await new Promise<number>((resolve, reject) => {
                    $$dialog({
                        editRequired: true,
                        editType: 'number',
                        editValue: 10,
                        onConfirm: val => resolve(val as any),
                        onCancel: reject,
                        confirmButton: true,
                        cancelButton: true,
                    })
                })
                return new Array(num).fill(null).map(() => deepcopy((!config.defaultNewRow ? {} : (typeof config.defaultNewRow === "function" ? config.defaultNewRow() : config.defaultNewRow))))
            })()
            newRows = await Promise.all(newRows.map((item) => hooks.onHandleNewRow.exec(item)))

            tableState.editingWhenAddRow = true
            tableState.list.unshift(...newRows)
            await nextTick()
            const newNodes = freezeState.table.flatNodes.value.slice(0, newRows.length)
            newNodes.forEach(node => {node.validate()})
            tableState.editingWhenAddRow = false

            confirm.open(eTableProStatus.batchInsert, {
                onConfirm: async () => {
                    const validateResults = (await Promise.all(newNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {errors, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchInsert')
                    requestConfig.body = {rows: await Promise.all(deepcopy(newNodes.map(node => node.editRow)).map(row => hooks.onBeforeSaveRow.exec(row)))}
                    requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    await request!(requestConfig)
                    confirm.close.clear()
                    await pageMethods.reload()
                },
                onCancel: async () => {
                    tableState.list.splice(0, newRows.length)
                },
            })
        }

        const copy = async (row?: Record<string, any>) => {
            await loadingMethods.save()
            if (!row) {
                if (!currentNode.value) {
                    return $$notice.warn('请选中一行要删除的数据！')
                }
                row = deepcopy(currentNode.value.data)
            }
            const excludeKeys = [...config.copyDefaultExcludeKeys, ...config.copyExcludeKeys || []]
            excludeKeys.forEach(key => delete row![key])
            return insert(row)
        }

        const saveUpdate = async (editRow: any) => {
            let {request, requestConfig} = utils.getUrlConfig('update')
            const saveRowPrev = await hooks.onBeforeSaveRow.exec(editRow)
            requestConfig.body = {row: deepcopy(saveRowPrev)}
            requestConfig = await hooks.onBeforeUpdate.exec(requestConfig)
            const newRowResult = await request!(requestConfig)
            let saveRowNext = await hooks.onAfterSaveRow.exec(newRowResult.newRow)
            saveRowNext = await hooks.onFormatRow.exec(saveRowNext)
            return saveRowNext
        }

        const update = async (updateNode?: TableNode, editType?: eTableProEditType) => {
            await loadingMethods.save()
            const node = updateNode || freezeState.table.getCurrent()
            if (!node) {
                throw new Error('update cancel, there are on select node to be update.')
            }

            const editInline = async () => {
                if (node.edit) {return}
                await nextTick()
                node.enableEdit()
                node.validate()
                confirm.open(eTableProStatus.update, {
                    onConfirm: async () => {
                        const validateResult = await node.validate()
                        if (!!validateResult) {
                            const {errors, node: {index}} = validateResult
                            $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                            return Promise.reject(validateResult)
                        }
                        const saveRow = await saveUpdate(node.editRow)
                        node.saveEdit(saveRow)
                        node.closeEdit()
                        await selectCurrent(saveRow[config.keyField])
                    },
                    onCancel: async () => {
                        node.cancelEdit()
                    },
                })
            }

            const editForm = async () => {
                tableOptionEditForm.edit({
                    node: node,
                    title: '编辑',
                    plcList: freezeState.table.plcData.value!.sourceFlatPlcList,
                    onConfirm: async (updateNode) => {
                        const saveRow = await saveUpdate(updateNode.editRow)
                        await node.saveEdit(saveRow)
                        await selectCurrent(saveRow[config.keyField])
                    },
                })
            }

            await ((editType || config.editType) === eTableProEditType.inline ? editInline() : editForm())
        }

        const batchUpdate = async () => {
            await loadingMethods.save()

            const updateNodes = [...freezeState.table.flatNodes.value]
            await nextTick()
            updateNodes.forEach(node => {
                node.enableEdit()
                node.validate()
            })
            confirm.open(eTableProStatus.batchUpdate, {
                onConfirm: async () => {
                    const validateResults = (await Promise.all(updateNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {errors, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchUpdate')
                    requestConfig.body = {rows: await Promise.all(deepcopy(updateNodes.map(node => node.editRow)).map(row => hooks.onBeforeSaveRow.exec(row)))}
                    requestConfig = await hooks.onBeforeUpdate.exec(requestConfig)
                    await request!(requestConfig)
                    confirm.close.clear()
                    await pageMethods.load()
                },
                onCancel: async () => {
                    updateNodes.forEach(node => {
                        node.cancelEdit()
                    })
                },
            })
        }

        const batchModify = async () => {
            const rows = await check.openToCheck()
            const newNode = freezeState.table.utils.getTreeNodeByData({
                data: {},
                level: 1,
                parentRef: () => null as any,
            })
            tableOptionModifyForm.modify({
                modifyNode: newNode,
                title: '批量修改',
                plcList: freezeState.table.plcData.value!.sourceFlatPlcList,
                onConfirm: async (node) => {
                    let {request, requestConfig} = utils.getUrlConfig('batchUpdate')
                    requestConfig.body = {
                        rows: deepcopy(rows.map(row => ({
                            id: row.id,
                            ...node.editRow,
                        }))),
                        updateFields: Object.keys(node.editRow),
                    }
                    await request!(requestConfig)
                    confirm.close.clear()
                    await pageMethods.reload()
                },
            })
        }

        const batchDelete = async () => {
            const rows = await check.openToCheck()
            let {request, requestConfig} = utils.getUrlConfig('batchDelete')
            requestConfig.body = deepcopy({id: rows.map(row => row.id)})
            requestConfig = await hooks.onBeforeDelete.exec(requestConfig)
            const deleteResult = await request!(requestConfig)
            if (!!deleteResult.error) {
                return $$notice.error(`删除失败：${deleteResult.error}`)
            }
            $$notice.success(`删除成功！`)
            confirm.close.clear()
            await pageMethods.load()
        }

        return {
            selectCurrent, insert, batchInsert, copy, update, batchUpdate, batchModify, batchDelete,

            ...loadingMethods,
        }

    })()

    hooks.onRefTable.use(table => freezeState.table = table)
    hooks.onLoading.use(flag => {
        if (pageMethods.isLoading.all) {return true}
        if (editMethods.isLoading.all) {return true}
        return flag
    })

    return {
        editMethods,
        pageMethods,
    }
}

export type tTableOptionMethods = ReturnType<typeof useTableOptionMethods>
