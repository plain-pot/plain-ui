import {VueNode} from "plain-ui-composition";
import {isVNode} from 'vue'

export function findReactElement(node: VueNode, isMatch: (node: VueNode) => boolean): VueNode[] | null {

    if (node == null) {return null}
    const type = typeof node
    switch (type) {
        case "number":
        case "string":
        case "boolean":
            return null
    }

    if (Array.isArray(node) && node.length > 0) {
        const ret: VueNode[] = []
        node.forEach(n => {
            const findList = findReactElement(n, isMatch)
            if (!!findList && findList.length > 0) {
                ret.push(...findList)
            }
        })
        return ret
    }

    if (isVNode(node)) {
        if (isMatch(node)) {
            return [node]
        }
        if (node.children && Array.isArray(node.children)) {
            const ret: VueNode[] = []
            node.children.forEach(n => {
                const findList = findReactElement(n, isMatch)
                if (!!findList && findList.length > 0) {
                    ret.push(...findList)
                }
            })
            return ret
        }
    }

    return null
}
