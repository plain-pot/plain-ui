export const nextIndex = (() => {
    let index = 1500
    return () => index++
})()