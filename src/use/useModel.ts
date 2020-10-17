import {ref, watch} from 'vue';

export function useModel<T>(getter: () => T, emitter: (val: T) => void) {

    const state = ref(getter()) as { value: T }

    watch(getter, (val: T) => {
        if (val != state.value) {
            state.value = val as any
        }
    })

    return {
        get value() {
            return state.value
        },
        set value(val: T) {
            state.value = val
            emitter((val))
        }
    }
}