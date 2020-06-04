import {computed, ref, watch} from "@vue/composition-api";

export type ModelType = { value: any }

/**
 * 双向绑定值组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useModel<T>(getter: () => T, emitter: (...args: any[]) => void, autoEmit = true, autoWatch = true): { value: T } {

    const state = ref(getter())

    if (autoWatch) {
        watch(
            getter,
            (val: any) => {
                state.value = val
            }
        )
    }

    const computedState = computed({
        get: () => state.value as (T | null),
        set: (val: any) => {
            state.value = val
            if (autoEmit) {
                emitter(state.value)
            }
        },
    })
    // @ts-ignore
    return computedState
}