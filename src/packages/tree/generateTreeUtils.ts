import {TreeNode} from "./core/type";
import {nextTick} from 'vue';

export function generateTreeUtils<Node extends TreeNode>(
    {
        getNode,
        props,
        state,
        emit,
    }: {
        getNode: (key: string) => Node | undefined | null,
        props: {
            lazy?: boolean,
            getChildren?: (node: Node, cb: (...args: any[]) => void) => void,
            childrenField?: string,
            according?: boolean,
            autoExpandParent?: boolean,
        },
        state: {
            root: Node,
        },
        emit: {
            onExpand: (node: Node) => void,
            onExpandChange: (keys: string[]) => void,
        }
    }
) {

    const utils = {
        /*遍历key或者node*/
        handleKeyOrNode: async (keyOrNode: string | Node | (string | Node)[], handler: (node: Node) => void | Promise<void>): Promise<void> => {
            if (!keyOrNode) {
                return
            }
            if (!Array.isArray(keyOrNode)) {
                const node = typeof keyOrNode === "string" ? getNode(keyOrNode) : keyOrNode
                if (!!node) {await handler(node)}
            } else {
                await Promise.all(keyOrNode.map(k => utils.handleKeyOrNode(k, handler)))
            }
        },
        /**
         * 获取子节点数据异步方法
         * @author  韦胜健
         * @date    2020/3/31 15:21
         */
        getChildrenAsync: (node: Node): Promise<Node[]> => {
            return new Promise((resolve) => {
                if (!props.getChildren) {
                    console.error('getChildren is required when using lazy mode!')
                    return
                }
                if (node.level === 0) {
                    !!state.root && (state.root.loading = true);
                } else {
                    node.loading = true
                }
                props.getChildren(node, (...results) => {
                    if (node.level === 0) {
                        !!state.root && (state.root.loading = false)
                    } else {
                        node.loading = false
                        node.loaded = true
                    }
                    resolve(...results)
                })
            })
        }
    }
    const baseMethods = {
        setChildrenData: (node: Node, children: any[]) => {
            !!props.childrenField && (node.data[props.childrenField] = children)
        }
    }

    const expandMethods = {
        expand: async (keyOrNode: string | Node | (string | Node)[]) => {
            await utils.handleKeyOrNode(keyOrNode,
                async (node) => {
                    const parent = node.parentRef()
                    if (!node.expand) {
                        if (
                            props.lazy &&                           // 懒加载模式
                            !node.loaded &&                       // 未曾加载过子节点数据
                            !node.isLeaf                            // 节点不是叶子节点
                        ) {
                            const children = await utils.getChildrenAsync(node)
                            baseMethods.setChildrenData(node, children || [])
                            await nextTick()
                        }

                        if (props.according) {
                            // 手风琴模式，展开某一个节点的时候，关闭兄弟节点
                            if (!!parent && !!parent.children) {
                                // parent.children.forEach((child: TreeNode) => child.key !== node.key && expandMethods.collapse(child))
                            }
                        }
                        node.expand = true
                        await nextTick()

                        emit.onExpand(node)
                        // emit.onExpandChange(expandKeys.value)
                    }
                    if (!!props.autoExpandParent && !!parent && parent.level !== 0) {
                        // await expandMethods.expand(parent)
                    }
                })
        }
    }
}