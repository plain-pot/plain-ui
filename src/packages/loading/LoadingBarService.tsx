import {computed, defineComponent, getCurrentInstance, reactive, set} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {StyleType} from "@/types/utils";

interface LoadingBarOption {
    color?: string,
    doneColor?: string,
    failColor?: string,
    height?: number,
    percent?: number,
    autoStart?: boolean,
    autoProcess?: boolean,
}

interface LoadingHandler {
    init: (option: LoadingBarOption) => void,
    update: (option: LoadingBarOption) => void,
    start: () => void,
    done: () => void,
    fail: () => void,
}

enum LoadingStatus {
    wait = 'wait',
    process = 'process',
    done = 'done',
    fail = 'fail',
}

const Service = defineComponent({
    setup() {

        const state = reactive({
            status: LoadingStatus.wait,
            isActive: false,
            option: null as null | LoadingBarOption,
            zIndex: 0,
            interval: null as null | number,
            autoLoadingStep: 5,
            startDelayer: null as null | number,
        })

        const color = computed(() => {
            switch (state.status) {
                case LoadingStatus.wait:
                    return null
                case LoadingStatus.process:
                    return state.option!.color
                case LoadingStatus.done:
                    return state.option!.doneColor
                case LoadingStatus.fail:
                    return state.option!.failColor
            }
        })

        const status = ['primary', 'success', 'warn', 'error', 'info']

        const classes = computed(() => [
            'pl-loading-bar-service',
            {
                [`pl-loading-bar-service-status-${color.value}`]: !!color.value && status.indexOf(color.value) > -1
            }
        ])

        const styles = computed(() => {
            if (!state.option) return {}
            return {
                height: `${state.option.height}px`,
                width: `${state.option!.percent}%`,
                backgroundColor: (!!color.value && status.indexOf(color.value) === -1) ? color.value : '',
                opacity: state.status === LoadingStatus.wait ? '0' : '1',
                zIndex: String(state.zIndex),
            } as StyleType
        })

        const methods = {
            /**
             * 开始自动播放进度
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            startAutoLoading() {
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
                }, 250)
            },
            /**
             * 停止自动播放进度
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            stopAutoLoading() {
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
            init(option: LoadingBarOption) {
                option.color == null && (set(option, 'color', 'primary'));
                option.doneColor == null && (set(option, 'doneColor', 'primary'));
                option.failColor == null && (set(option, 'failColor', 'error'));
                option.percent == null && (set(option, 'percent', 0));
                option.height == null && (set(option, 'height', 4));
                option.autoStart == null && (set(option, 'autoStart', true));
                option.autoProcess == null && (set(option, 'autoProcess', true));

                state.option = option

                return methods
            },
            /**
             * 更新option
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            update: (option: LoadingBarOption) => {
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
                    state.isActive = true
                    state.option.percent = 0

                    state.status = LoadingStatus.process
                    state.zIndex = $plain.nextIndex()

                    await $plain.utils.delay(23)
                    state.option.percent = percent

                    if (state.option!.autoProcess) {
                        methods.startAutoLoading()
                    }
                }, 100)
            },
            /**
             * 加载完成
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            done: async () => {
                state.status = LoadingStatus.done
                await methods.complete()
            },
            /**
             * 加载失败
             * @author  韦胜健
             * @date    2020/9/25 21:16
             */
            fail: async () => {
                state.status = LoadingStatus.fail
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
                await $plain.utils.delay(300)
                state.status = LoadingStatus.wait
                await $plain.utils.delay(300)
                state.isActive = false
                state.option = null
            },
        };

        (getCurrentInstance() as any).state = state;
        (getCurrentInstance() as any).methods = methods;

        return () => (
            !!state.isActive && (
                <div class={classes.value} style={styles.value}/>
            )
        )
    },
})

const Controller = defineComponent({
    setup() {

        const refs = useRefs({
            items: [] as any[]
        })

        const state = reactive({
            count: [0],
        });

        const newService = async () => {
            let service = refs.items.find(item => !item.state.isActive)
            if (!service) {
                state.count.push(state.count.length)
                await $plain.nextTick()
                return newService()
            } else {
                return service
            }
        }

        (getCurrentInstance() as any).newService = newService;

        return () => (
            <div class="pl-loading-bar-service-controller">
                {state.count.map(i => (
                    <Service key={i} ref="items" {...{refInFor: true}}/>
                ))}
            </div>
        )
    },
})

export const $loadingBar = (() => {

    let controller: any;

    return async (option: LoadingBarOption = {}): Promise<LoadingHandler> => {

        if (!controller) {
            controller = await $plain.newInstance(Controller)
        }
        const service = await controller.newService()
        const handler = service.methods.init(option) as LoadingHandler

        if (option.autoStart) {
            handler.start()
        }

        return handler
    }
})()