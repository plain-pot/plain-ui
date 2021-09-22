import {TreeNode} from "./type";

const basePadding = 8

export const TreeUtils = {
    getPaddingLeft: (level: number, intent: number) => {
        return basePadding + (level - 1) * intent
    },
    /**
     * 计算treeNode的样式
     * @author  韦胜健
     * @date    2020/11/28 9:25
     */
    getTreeNodeStyles: (level: number, intent: number, nodeHeight: number) => {
        const basePadding = 8
        return {
            paddingLeft: `${TreeUtils.getPaddingLeft(level, intent)}px`,
            paddingRight: `${basePadding}px`,
            height: `${nodeHeight}px`,
        }
    },
    /**
     * 计算tree node的class
     * @author  韦胜健
     * @date    2020/11/28 10:35
     */
    getTreeNodeClasses: (node: TreeNode, current?: string | number) => {
        return [
            'pl-tree-node',
            {
                'pl-tree-node-current': node.key == current,
                'pl-tree-node-not-checkable': !node.isCheckable,
            }
        ]
    },
}