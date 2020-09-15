import {reactive, set, UnwrapRef} from "@vue/composition-api";

export function createFlagManager<T = boolean>() {
    return {
        state: reactive({
            map: {} as { [k: string]: T }
        }),
        get(key: string) {
            return this.state.map[key]
        },
        set(key: string, val: UnwrapRef<T>) {
            if (this.state.map.hasOwnProperty(key)) {
                this.state.map[key] = val
            } else {
                set(this.state.map, key, val)
            }
        },
    }
}