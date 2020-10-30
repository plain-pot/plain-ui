export function createCounter(prefixString?: string) {
    let count = 0
    return () => (!!prefixString ? `${prefixString}_` : '') + count++
}