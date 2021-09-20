const DEMO_ROW_STORAGE_KEY = 'DEMO_ROW'

export const DemoRowCache = (() => {
    let str = localStorage.getItem(DEMO_ROW_STORAGE_KEY)
    const cache: Record<string, boolean> = !!str ? JSON.parse(str) : {}

    return {
        get: (id: string) => {
            const flag = cache[id]
            return flag == null ? true : flag
        },
        set: (id: string, flag: boolean) => {
            cache[id] = flag
            localStorage.setItem(DEMO_ROW_STORAGE_KEY, JSON.stringify(cache))
        },
        setAll: (flag: boolean) => {
            for (const key in cache) {
                cache[key] = flag
            }
            localStorage.setItem(DEMO_ROW_STORAGE_KEY, JSON.stringify(cache))
        },
    }
})()