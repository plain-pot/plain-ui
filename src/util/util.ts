import PlainUtils from '../../submodules/plain-utils'

export function toArray<T>(t: T | T[]): T[] {
    return Array.isArray(t) ? t : [t]
}

export {PlainUtils}