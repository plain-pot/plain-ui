import {TreeNode} from "../utils/TreeNode";
import {TreeMark} from "../utils/TreeMark";

export const TreeUtils = {
    /**
     * 遍历所有的treeNode
     * @author  韦胜健
     * @date    2020/3/30 19:30
     * @param   treeNodes               要遍历的数据
     * @param   fn                      处理函数
     * @param   iterateChildren         判断是否遍历其子节点数据
     */
    iterateAll: (
        treeNodes: TreeNode[] | Readonly<TreeNode[]> | null,
        fn: (node: TreeNode) => void,
        iterateChildren?: (node: TreeNode) => boolean
    ): void => {
        if (!treeNodes) return
        treeNodes.forEach(treeNode => {
            fn(treeNode)
            if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                TreeUtils.iterateAll(treeNode.children, fn, iterateChildren)
            }
        })
    },
    /**
     * 计算treeNode的样式
     * @author  韦胜健
     * @date    2020/11/28 9:25
     */
    getTreeNodeStyles: (level: number, intent: number) => {
        const basePadding = 8
        return {
            paddingLeft: `${basePadding + (level - 1) * intent}px`,
            paddingRight: `${basePadding}px`,
        }
    },
    /**
     * 计算tree node的class
     * @author  韦胜健
     * @date    2020/11/28 10:35
     */
    getTreeNodeClasses: (node: TreeNode, current?: string) => {
        return [
            'pl-tree-node',
            {
                'pl-tree-node-current': node.key === current,
            }
        ]
    },
    /**
     * 通过 key 寻找treeNode
     * @author  韦胜健
     * @date    2020/3/30 20:52
     */
    findTreeNodeByKey: (key: string, mark: TreeMark): TreeNode | null => {
        const treeNode = mark.node.getByKey(key)
        if (!treeNode) {
            console.warn(`无法找到treeNode：${key}`, mark.node.state.map)
            return null
        }
        return treeNode
    },
    /**
     * 处理keyOrNode
     * @author  韦胜健
     * @date    2020/11/28 9:34
     */
    handleKeyOrNode: async (
        mark: TreeMark,
        keyOrNode: string | TreeNode | (string | TreeNode)[],
        handler: (node: TreeNode) => void | Promise<void>,
    ): Promise<any> => {
        if (!keyOrNode) {
            return
        }
        if (typeof keyOrNode === "string") {
            const node = TreeUtils.findTreeNodeByKey(keyOrNode, mark)
            if (!!node) {
                await handler(node)
            }
        } else if (!Array.isArray(keyOrNode)) {
            await handler(keyOrNode)
        } else {
            await Promise.all(keyOrNode.map(i => TreeUtils.handleKeyOrNode(mark, i, handler)))
        }
    },
    /**
     * 获取子节点数据异步方法
     * @author  韦胜健
     * @date    2020/3/31 15:21
     */
    getChildrenAsync: <T extends {
        key: string,
        level: number,
        loading: (val: boolean) => void,
        loaded: (val: boolean) => void
    }>(
        treeNode: T,
        state: { loading: boolean },
        getChildren?: (node: T, cb: (...args: any[]) => void) => void,
    ): Promise<T[]> => {
        return new Promise((resolve) => {
            if (!getChildren) {
                console.error('getChildren is required when using lazy mode!')
                return
            }
            if (treeNode.level === 0) {
                state.loading = true
            } else {
                treeNode.loading(true)
            }
            getChildren(treeNode, (...results) => {
                if (!treeNode.key) {
                    state.loading = false
                } else {
                    treeNode.loading(false)
                    treeNode.loaded(true)
                }
                resolve(...results)
            })
        })
    },
    /**
     * 懒加载初始化逻辑
     * @author  韦胜健
     * @date    2020/11/28 10:45
     */
    async initialize(
        option: {
            rootTreeNode: TreeNode,
            lazy: boolean,
            data: { value: any },
            state: { loading: boolean },
            getChildren?: (node: TreeNode, cb: (...args: any[]) => void) => void,
        },
    ) {
        if (!option.lazy) {return}
        option.data.value = await TreeUtils.getChildrenAsync(option.rootTreeNode, option.state, option.getChildren)
    },
}