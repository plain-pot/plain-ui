import PlainUtils from '../../submodules/plain-utils'

export function toArray<T>(t: T | T[]): T[] {
    return Array.isArray(t) ? t : [t]
}

export function getReturnType<T>(func: (...args: any[]) => T): T {
    // @ts-ignore
    return null
}

export {PlainUtils}