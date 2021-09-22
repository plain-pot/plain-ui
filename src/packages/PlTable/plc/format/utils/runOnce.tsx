export function runOnce<Run extends (...args: any) => void>(run: Run): Run {
    let done = false
    return ((...args: any[]) => {
        if (!done) {
            run(...args)
            done = true
        }
    }) as any
}