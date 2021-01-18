export function prefix(val: string | number, config?: { char?: string, len?: number }) {
    if (typeof val !== "string") {
        val = String(val)
    }
    let len = val.length
    if (!config) config = {}
    while (len < (config.len || 2)) {
        val = (config.char || '0') + val
        len++
    }
    return val
}