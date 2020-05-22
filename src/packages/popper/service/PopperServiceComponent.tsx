import {computed, defineComponent, getCurrentInstance, reactive} from "@vue/composition-api";
import {PopperAgent} from "@/packages/popper/service/PopperAgent";
import {PopperAgentOption} from "@/packages/popper/service/PopperAgentOption";
import {$plain} from "@/packages/base";
import {useRefer} from "@/use/useRefer";

const POPPER_SERVICE_DEFAULT_POPPER_PROPS = {
    placement: 'bottom-start',
    trigger: 'manual',
    transition: 'pl-transition-scale',
}

export interface PopperServiceComponent {
    state: any,
    popperBinding: any,
    isPrivate: any,
    options: any,

    show: Function,
    hide: Function,
    bind: Function,
    unbind: Function,
    toggle: Function,
}

export function usePopperServiceComponent(
    {
        name,
        content,
        externalListener,
        externalPopperListener,
        defaultPopperProps,
    }: {
        name: string,                                                       // service组件名称
        content: (h: Function, Service: any) => any,                        // 内容渲染函数
        externalListener?: { [key: string]: Function },                     // 额外的事件监听器
        externalPopperListener?: { [key: string]: Function },               // 额外的popper事件监听器
        defaultPopperProps?: { [key: string]: any },                        // 默认的popper参数
    }
) {

    externalListener = externalListener || {}
    externalPopperListener = externalPopperListener || {}
    defaultPopperProps = defaultPopperProps || {}

    return defineComponent({
        name,
        setup: function () {

            const ctx = getCurrentInstance()!

            /*---------------------------------------state-------------------------------------------*/

            const state = reactive({
                show: false,
                open: false,
                agent: null as PopperAgent | null,
                count: 0,
            })

            const options = computed(() => {
                let option: PopperAgentOption | (() => PopperAgentOption) = !!state.agent ? state.agent.option : {} as PopperAgentOption

                if (typeof option === 'function') {
                    option = option()
                }

                let {props, popperProps, listener, popperListener, beforeShow, beforeHide, isPrivate} = option

                props = props || {}
                popperProps = popperProps || {}
                listener = listener || {}
                popperListener = popperListener || {}

                const contentListener = {
                    emit: ({event, args}: { event: string, args: any[] }) => {
                        if (!!externalListener![event]) {
                            externalListener![event].apply(ctx, args)
                        }
                        if (!!listener![event]) {
                            listener![event].apply(ctx, args)
                        }
                    },
                }

                popperProps = {
                    ...POPPER_SERVICE_DEFAULT_POPPER_PROPS,
                    ...defaultPopperProps,
                    ...popperProps,
                }

                return {
                    popperProps,
                    props,
                    listener: contentListener,
                    popperListener,
                    beforeShow,
                    beforeHide,
                    isPrivate,
                }

            })

            const isPrivate = computed(() => {
                if (!state.agent) return false
                return options.value.isPrivate
            })

            const popperBinding = computed(() => {
                const {popperListener, popperProps} = options.value

                return {
                    props: {
                        value: state.show,
                        open: state.open,
                        popperClass: `${name}-popper`,
                        ...popperProps,
                    },
                    on: {
                        emit: ({event, args}: { event: string, args: any[] }) => {
                            if (!!externalPopperListener![event]) {
                                externalPopperListener![event].apply(ctx, args)
                            }
                            if (!!popperListener[event]) {
                                popperListener[event].apply(ctx, args)
                            }
                        },
                        input: val => state.show = val,
                        'update:open': val => state.open = val,
                        close: () => {
                            if (!!state.agent && !!state.agent.service) {
                                state.agent.service = undefined
                                state.agent = null
                            }
                        },
                        'click-body': () => {
                            if (state.show) {
                                methods.hide()
                            }
                        },
                    }
                }
            })

            const methods = {
                show: async () => {
                    if (!!state.show) return
                    state.count++
                    await $plain.nextTick()
                    if (!!options.value.beforeShow) await options.value.beforeShow()
                    state.show = true
                },
                hide: async () => {
                    if (!state.show) return
                    if (!!options.value.beforeHide) await options.value.beforeHide()
                    state.show = false
                },
                bind: (agent: PopperAgent) => {
                    if (!!state.agent) {
                        state.agent.service = undefined
                    }
                    state.agent = agent
                    // @ts-ignore
                    state.agent.service = ctx
                },
                unbind: (agent) => {
                    if (agent === state.agent) {
                        state.agent = null
                    }
                    agent.service = null
                },
                toggle: () => {
                    if (state.show) {
                        methods.hide()
                    } else {
                        methods.show()
                    }
                }
            }
            useRefer({
                ...methods,
                popperBinding,
                isPrivate,
                state,
                options,
            })

            return () => (
                <pl-popper class={name} {...popperBinding.value}>
                    {content(ctx.$createElement, ctx)}
                </pl-popper>
            )
        },
    })
}