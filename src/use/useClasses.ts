import {computed} from 'vue'

type SingleClass = null | undefined | string | { [k: string]: boolean }
type MultipleClass = SingleClass | SingleClass[]

export function useClass<T extends () => MultipleClass>(fn: T) {
    return computed(fn)
}