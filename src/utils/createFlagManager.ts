/**
 * 给mark对象使用，用来创建管理flag的对象
 * @author  韦胜健
 * @date    2020/11/27 11:38
 */
import {UnwrapRef} from "plain-design-composition";
import {reactive} from "plain-design-composition";

export function createFlagManager<T = boolean>() {
    return {
        state: reactive({
            map: {} as { [k: string]: T }
        }),
        get(key: string) {
            return this.state.map[key]
        },
        set(key: string, val: UnwrapRef<T>) {
            /*if (this.state.map.hasOwnProperty(key)) {
                this.state.map[key] = val
            } else {
                set(this.state.map, key, val)
            }*/
            this.state.map[key] = val
        },
        getActiveKeys(): string[] {
            const keys: string[] = []
            for (let key in this.state.map) {
                if (!!this.state.map[key]) {
                    keys.push(key)
                }
            }
            return keys
        }
    }
}