import {computed, nextIndex, reactive, ref, useClasses} from "plain-ui-composition";
import {createDefaultService} from "../../PlRoot/createDefaultService";
import {LoadingBarFormatOption, LoadingBarStatus} from "./index";
import {delay} from "plain-utils/utils/delay";
import './loading-bar.scss'
import {StyleProperties} from "plain-ui-composition/src/use/useStyles";

export default createDefaultService({
    name: 'pl-loading-bar-service',
    setup(option: LoadingBarFormatOption) {

        const isShow = ref(false)

        const state = reactive({
            status: LoadingBarStatus.wait,
            option: option as LoadingBarFormatOption | null,
            zIndex: 0,
            interval: null as null | number,
            autoLoadingStep: 5,
            startDelayer: null as null | number,
        })

        const color = computed(() => {
            switch (state.status) {
                case LoadingBarStatus.wait:
                    return null
                case LoadingBarStatus.process:
                    return state.option!.color
                case LoadingBarStatus.done:
                    return state.option!.doneColor
                case LoadingBarStatus.fail:
                    return state.option!.failColor
            }
            return LoadingBarStatus.process
        })

        const status = ['primary', 'success', 'warn', 'error', 'info']

        const classes = useClasses(() => [
            'pl-loading-bar-service',
            {
                [`pl-loading-bar-service-status-${color.value}`]: !!color.value && status.indexOf(color.value) > -1
            }
        ])

        const styles = computed(() => {
            if (!state.option) return {} as StyleProperties
            return {
                height: `${state.option.height}px`,
                width: `${state.option!.percent}%`,
                backgroundColor: (!!color.value && status.indexOf(color.value) === -1) ? color.value : '',
                opacity: state.status === LoadingBarStatus.wait ? '0' : '1',
                zIndex: String(state.zIndex),
            } as StyleProperties
        })

        const methods = {
            /**
             * 开始自动播放进度
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            startAutoLoading: () => {
                state.autoLoadingStep = 10
                state.interval = setInterval(() => {
                    if (!!state.option) {
                        if (state.option.percent == null) {
                            state.option.percent = 0
                        }
                        state.option.percent += state.autoLoadingStep
                        state.autoLoadingStep -= 0.5
                        if (state.option.percent + 20 > 100 || state.autoLoadingStep < 0) {
                            methods.stopAutoLoading()
                        }
                    } else {
                        methods.stopAutoLoading()
                    }
                }, 250) as any as number
            },
            /**
             * 停止自动播放进度
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            stopAutoLoading: () => {
                if (!!state.interval) {
                    clearInterval(state.interval)
                    state.interval = null
                }
            },
            /**
             * 初始化option
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            init: (option: LoadingBarFormatOption) => {
                state.option = option
                Object.assign(option, methods)
                return methods
            },
            /**
             * 更新option
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            update: (option: LoadingBarFormatOption) => {
                if (!!state.option) {
                    Object.assign(state.option, option)
                }
                methods.stopAutoLoading()
            },
            /**
             * 开始loading
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            start: async () => {
                state.startDelayer = setTimeout(async () => {
                    if (!state.option) {
                        return
                    }

                    const percent = state.option.percent
                    isShow.value = true
                    state.option.percent = 0

                    state.status = LoadingBarStatus.process
                    state.zIndex = nextIndex()

                    await delay(23)
                    state.option.percent = percent

                    if (state.option!.autoProcess) {
                        methods.startAutoLoading()
                    }
                }, 100) as any as number
            },
            /**
             * 加载完成
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            done: async () => {
                state.status = LoadingBarStatus.done
                await methods.complete()
            },
            /**
             * 加载失败
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            fail: async () => {
                state.status = LoadingBarStatus.fail
                await methods.complete()
            },
            complete: async () => {
                if (!state.option) {
                    return
                }
                if (state.startDelayer != null) {
                    clearTimeout(state.startDelayer)
                    state.startDelayer = null
                }
                methods.stopAutoLoading()
                state.option!.percent = 100
                await delay(300)
                state.status = LoadingBarStatus.wait
                await delay(300)
                isShow.value = false
                state.option = null
            },
        };


        const service = (option: LoadingBarFormatOption) => {
            methods.init(option)
            if (!!option.autoStart) {
                methods.start()
            }
        }

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => isShow.value && (
                <div class={classes.value} style={styles.value as any}/>
            )
        }
    },
})