interface Defer {
    (): {
        resolve: () => void,
        reject: (...args: any[]) => void,
        promise: Promise<void>
    },

    <T>(): {
        resolve: (val: T) => void,
        reject: (...args: any[]) => void,
        promise: Promise<T>
    },
}

export const defer: Defer = () => {
    const dfd = {} as any
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve as any
        dfd.reject = reject
    })
    return dfd
}