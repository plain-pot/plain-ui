import {reactive, watch} from "@vue/composition-api";

export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

export function useProps<T = any>(props: T, option: { [key in keyof T]?: FormatPropsType | FormatPropsType[] }, watcher?: any): any {
    const keys = Object.keys(option)
    let state = {} as any

    keys.forEach(key => {
        state[key] = props[key]
    })

    state = reactive(state)


    keys.forEach(key => {
        watch(
            () => props[key],
            (val) => {
                console.log('props change ->', key, val)
                state[key] = val
            },
        )
    })

    return state
}



