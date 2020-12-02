import {reactive} from "vue"

export function useFlagManager<Node extends { key: string }, Value>() {
    const state = reactive({
        map: {}
    }) as { map: Record<string, Value> }
    return {
        state,
        get: (keyOrNode: string | Node): Value => {
            return state.map[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key]
        },
        set: (keyOrNode: string | Node, value: Value) => {
            state.map[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = value
        },
        setAll: (value: Value) => {
            for (let key in state.map) {
                state.map[key] = value
            }
        },
        clear: () => {
            state.map = {}
        },
        /*弃用，因为删除节点之后，有些key是作废无效的*/
        /*getActiveKeys: () => {
            let keys = [] as string[]
            for (let key in state.map) {
                if (!!state.map[key]) {
                    keys.push(key)
                }
            }
            return keys
        },*/
    }
}