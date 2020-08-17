import {TableNode} from "@/packages/table/table-bak/TableNode";
import {TableMark, TableMarkAttr} from "@/packages/table/table-bak/TableMark";
import {$plain} from "@/packages/base";
import {computed, Ref} from "@vue/composition-api";
import {TreeNode} from "@/packages/tree/utils/TreeNode";

export function usePlcTree(
    {
        mark,
        isLoading,
        getChildren,
        lazy,
        rootTableNode,
        according,
        autoExpandParent,
        emit,
        tableData,
        checkStrictly,
    }: {
        mark: TableMark,
        isLoading: Ref<boolean | null>,
        getChildren?: Function,
        lazy: boolean | undefined,
        rootTableNode: TableNode,
        according?: boolean,
        autoExpandParent?: boolean,
        emit: {
            expand: (node: TableNode) => void,
            collapse: (node: TableNode) => void,
            expandChange: (expandKeys: string[]) => void,

            check: (node: TableNode) => void,
            uncheck: (node: TableNode) => void,
            checkChange: (checkKeys: string[]) => void,
        },
        tableData: Ref<TableNode[]>,
        checkStrictly: boolean | undefined,
    }) {

    const emitExpandKeys = computed(() => mark.getActiveKeys(TableMarkAttr.expand))
    const emitCheckKeys = computed(() => mark.getActiveKeys(TableMarkAttr.check))

    const utils = {
        /**
         * 处理keys
         * @author  韦胜健
         * @date    2020/8/17 10:00
         */
        handleKeys: async (keys: string | string[], handler: (value: string, index: number, array: string[]) => unknown) => {
            keys = Array.isArray(keys) ? keys : [keys]
            return await Promise.all(keys.map(handler))
        },
        /**
         * 遍历所有的treeNode
         * @author  韦胜健
         * @date    2020/8/17 9:59
         */
        iterateAll: (treeNodes: TableNode[] | null, fn: (node: TableNode) => void, iterateChildren?: Function): void => {
            if (!treeNodes) return
            treeNodes.forEach(treeNode => {
                fn(treeNode)
                if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                    utils.iterateAll(treeNode.children, fn, iterateChildren)
                }
            })
        },
        /**
         * 通过 key 寻找TableNode
         * @author  韦胜健
         * @date    2020/8/17 9:59
         */
        findNodeByKey: (key: string): TableNode | null => {
            const node = mark.getMark(key, TableMark.node)
            if (!node) {
                console.warn(`无法找到treeNode：${key}`, mark.nodeMap)
                return null
            }
            // @ts-ignore
            return node
        },
        /**
         * 获取子节点数据异步方法
         * @author  韦胜健
         * @date    2020/3/31 15:21
         */
        getChildrenAsync: (node: TableNode): Promise<TableNode[]> => {
            return new Promise((resolve) => {
                if (node.key.indexOf('root-node') === 0) {
                    isLoading.value = true
                } else {
                    mark.setMark(node.key, TableMarkAttr.loading, true)
                }
                getChildren!(node, (...results) => {

                    if (node.key.indexOf('root-node') === 0) {
                        isLoading.value = false
                    } else {
                        mark.setMark(node.key, TableMarkAttr.loading, false)
                        mark.setMark(node.key, TableMarkAttr.loaded, true)
                    }

                    resolve(...results)
                })
            })
        },
        /**
         * 懒加载模式下，第一次初始化数据
         * @author  韦胜健
         * @date    2020/8/17 10:05
         */
        async initLazy() {
            if (!lazy) {
                return
            }
            rootTableNode.setChildren(await utils.getChildrenAsync(rootTableNode))
        },
    }

    const methods = {

        /*---------------------------------------expand-------------------------------------------*/

        /**
         * 展开节点
         * @author  韦胜健
         * @date    2020/8/17 10:17
         */
        async expand(keys: string | string[]) {
            await utils.handleKeys(keys, async key => {
                const node = utils.findNodeByKey(key)
                if (!node) return
                if (!node.isExpand) {
                    if (
                        lazy &&
                        !node.isLoaded &&
                        !node.isLeaf
                    ) {
                        const children = await utils.getChildrenAsync(node)
                        node.setChildren(children)
                        await $plain.nextTick()
                    }

                    if (according) {
                        if (!!node.parent && !!node.parent.children) {
                            node.parent.children.forEach(child => child.key !== node.key && methods.collapse(child.key))
                        }
                    }

                    node.expand(true)
                    await $plain.nextTick()
                    emit.expand(node)
                    emit.expandChange(emitExpandKeys.value as string[])

                    if (autoExpandParent && !!node.parent) {
                        await methods.expand(node.parent.key)
                    }
                }
            })
        },
        /**
         * 收起节点
         * @author  韦胜健
         * @date    2020/8/17 10:17
         */
        async collapse(keys: string | string[]) {
            await utils.handleKeys(keys, async key => {
                const node = utils.findNodeByKey(key)
                if (!node) return
                if (node.isExpand) {
                    node.expand(false)
                    await $plain.nextTick()
                    emit.collapse(node)
                    emit.expandChange(emitExpandKeys.value as string[])
                }
            })
        },
        /**
         * 开启/关闭节点
         * @author  韦胜健
         * @date    2020/8/17 10:20
         */
        async toggleExpand(key: string) {
            const node = utils.findNodeByKey(key)
            if (!node) return node
            if (node.isExpand) {
                await methods.collapse(node.key)
            } else {
                await methods.expand(node.key)
            }
        },
        /**
         * 开启所有节点
         * @author  韦胜健
         * @date    2020/8/17 10:21
         */
        async expandAll() {
            if (!!tableData.value && tableData.value.length > 0) {
                utils.iterateAll(tableData.value, node => methods.expand(node.key))
            }
        },
        /**
         *
         * @author  收起所有节点
         * @date    2020/8/17 10:33
         */
        async collapseAll() {
            mark.expandMap = {}
        },

        /*---------------------------------------check-------------------------------------------*/

        /**
         * 根据keys选中节点
         * @author  韦胜健
         * @date    2020/8/17 15:20
         */
        async check(keys: string | string[]) {
            await utils.handleKeys(keys, async key => {
                const node = utils.findNodeByKey(key)
                if (!node) return
                if (!node.isCheck) {
                    node.check(true)

                    if (!checkStrictly) {
                        // 选中所有子节点
                        utils.iterateAll(node.children || [], (child) => child.check(true))

                        // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                        let parent = node.parent
                        while (!!parent && !!parent.key) {
                            if ((parent.children || []).every(child => child.isCheck)) {
                                parent.check(true)
                                parent = parent.parent
                            } else {
                                break
                            }
                        }
                    }

                    await $plain.nextTick()
                    emit.check(node)
                    emit.checkChange(emitCheckKeys.value as string[])
                }
            })
        },

        /**
         * 根据keys取消选中节点
         * @author  韦胜健
         * @date    2020/8/17 15:33
         */
        async uncheck(keys: string | string[]) {
            await utils.handleKeys(keys, async key => {
                const node = utils.findNodeByKey(key)
                if (!node) return
                if (node.isCheck) {
                    node.check(false)
                    if (!checkStrictly) {
                        // 取消选中所有子节点
                        utils.iterateAll(node.children || [], (child) => child.check(false))
                        // 更新父节点状态，如果父节点所有的子节点都处于非选中状态，则更新父节点为非选中状态
                        let parent = node.parent
                        while (!!parent && !!parent.key) {
                            if (parent.isCheck) {
                                parent.check(false)
                                parent = parent.parent
                            } else {
                                break
                            }
                        }
                    }

                    await $plain.nextTick()
                    emit.check(node)
                    emit.checkChange(emitCheckKeys.value as string[])
                }
            })
        },

        /**
         * 根据key选中或者取消选中树节点
         * @author  韦胜健
         * @date    2020/8/17 15:39
         */
        async toggleCheck(key) {
            const node = utils.findNodeByKey(key)
            if (!node) return
            if (!node.isCheckable) return
            if (node.isCheck) {
                await methods.uncheck(key)
            } else {
                await methods.check(key)
            }
        },
        /**
         * 选中所有节点
         * @author  韦胜健
         * @date    2020/8/17 15:40
         */
        checkAll() {
            utils.iterateAll(tableData.value, (node: TableNode) => node.check(true))
        },
        /**
         * 取消选中所有节点
         * @author  韦胜健
         * @date    2020/8/17 15:40
         */
        uncheckAll() {
            mark.checkMap = {}
        },
        /**
         * 获取选中的数据
         * @author  韦胜健
         * @date    2020/8/17 15:41
         */
        getCheckedData() {
            let ret: object[] = []
            utils.iterateAll(tableData.value, (node: TableNode) => {
                if (node.isCheck) {
                    ret.push(node.data)
                }
            })
            return ret
        },
    }

    const handler = {
        clickExpandIcon: async (e: MouseEvent, node: TableNode) => {
            e.stopPropagation()
            await methods.toggleExpand(node.key)
        },
        clickCheckbox: async (e: MouseEvent, node: TableNode) => {
            e.stopPropagation()
            await methods.toggleCheck(node.key)
        }
    }

    return {
        utils,
        handler,
        methods,
        emitExpandKeys,
        emitCheckKeys,
    }
}