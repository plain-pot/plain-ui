/**
 * 创建一个报错对象
 * @author  韦胜健
 * @date    2020/10/15 10:33
 */
export function createError(tag: string) {
    return (msg: string, isLog?: boolean) => {
        const message = `${tag}:${msg}`
        const log = isLog == null ? true : isLog
        if (log) {
            console.error(message)
        } else {
            throw new Error(message)
        }
    }
}