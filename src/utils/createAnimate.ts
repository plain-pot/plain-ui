export function createAnimate(
    {
        initValue,
        time,
        action,
    }: {
        initValue: () => number,
        time: number,
        action: (val: number) => void,
    }) {

    let cancel = null as null | number

    return {
        start: (percent: number, done?: () => void) => {
            if (cancel != null) {
                cancelAnimationFrame(cancel)
            }
            let startTime = Date.now()

            let n = initValue()
            let k = (percent - n) / time

            const run = () => {
                let nowTime = Date.now()
                let deltaTime = nowTime - startTime

                if (deltaTime > time) {
                    cancel = null
                    action(percent)
                    !!done && done()
                    return
                }
                action(Number((deltaTime * k + n).toFixed(2)))
                cancel = requestAnimationFrame(run)
            }
            run()
        },
        stop: () => {
            if (cancel != null) {
                cancelAnimationFrame(cancel)
            }
        }
    }
}