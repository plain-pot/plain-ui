import {computed} from 'vue'

export type SingleClass = null | undefined | string | { [k: string]: boolean | null | undefined }
export type MultipleClass = SingleClass | SingleClass[]

export function useClass<T extends () => MultipleClass>(fn: T) {
    return computed(fn)
}