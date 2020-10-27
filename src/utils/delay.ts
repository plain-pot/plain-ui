export function delay(timer = 0) {
    return new Promise((resolve) => setTimeout(resolve, timer))
}