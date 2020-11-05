import {ref, onBeforeUpdate, Ref} from 'vue';

interface UseRefList {
    <T = any>(reactive: true): Ref<T[]>

    <T = any>(): T[]
}

export const useRefList: UseRefList = <T>(reactive?: boolean) => {
    if (reactive) {
        const refs = ref([] as T[])
        onBeforeUpdate(() => refs.value = [])
        return refs
    } else {
        const refs = [] as any
        onBeforeUpdate(() => refs.splice(0, refs.length))
        return refs
    }
}
