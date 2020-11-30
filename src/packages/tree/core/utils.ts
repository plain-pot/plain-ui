import {TreeNode} from "./type";

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
        {
            nodes,
            handler,
            iterateChildren,
        }: {
            nodes?: TreeNode[] | Readonly<TreeNode[]> | null,
            handler: (node: TreeNode) => void,
            iterateChildren?: (node: TreeNode) => boolean,
        },
    ): void => {
        if (!nodes) return
        nodes.forEach(treeNode => {
            handler(treeNode)
            if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                TreeUtils.iterateAll({
                    nodes: treeNode.children,
                    handler,
                    iterateChildren,
                })
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
                'pl-tree-node-not-checkable': !node.isCheckable,
            }
        ]
    },
}