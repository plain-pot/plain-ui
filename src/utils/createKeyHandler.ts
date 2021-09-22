/**
 * 创建一个用来管理key的对象
 * @author  韦胜健
 * @date    2020/11/27 11:38
 */
export function createKeyHandler(prefix: string) {
    const map = new WeakMap<any, string>()
    let count = 1
    return (obj: any, keyField?: string | null): string => {
        if (!!keyField && obj[keyField]) {
            return obj[keyField]
        }
        let key = map.get(obj)
        if (!key) {
            key = `${prefix}_${count++}`
            map.set(obj, key)
        }
        return String(key)
    }
}