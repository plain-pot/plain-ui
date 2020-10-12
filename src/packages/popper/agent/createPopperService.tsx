import {designComponent} from "@/use/designComponent";
import {computed, reactive, watch} from "@vue/composition-api";
import {PopperAgent, PopperAgentDefaultPopperProps, PopperServiceOption} from "@/packages/popper/agent/type";

export function createPopperService(
    {
        name,
        render,
        externalPopperListener,
        externalRenderListener,
        defaultPopperProps,
        hideOnClickBody,
    }: PopperServiceOption) {

    const ComponentName = `pl-popper-service-${name}`;
    externalPopperListener == null && (externalPopperListener = {});
    externalRenderListener == null && (externalRenderListener = {});
    defaultPopperProps == null && (defaultPopperProps = {});
    hideOnClickBody == null && (hideOnClickBody = true);

    return designComponent({
            name: ComponentName,
            props: {
                agent: {
                    type: Object as any as new() => PopperAgent,
                    required: true,
                }
            },
            setup(serviceProps) {
                const state = reactive({
                    count: 0,
                })

                watch(() => serviceProps.agent, () => {
                    // console.log('agent change', serviceProps.agent)
                    state.count++
                })

                const option = computed(() => {
                    let {
                        reference,
                        beforeShow,
                        beforeHide,
                        popperProps,
                        popperListener,
                        props,
                        listener,
                        isPrivate,
                    } = serviceProps.agent.state.optionGetter()

                    props == null && (props = {});
                    listener == null && (listener = {});
                    popperProps == null && (popperProps = {});
                    popperListener == null && (popperListener = {});

                    const targetListener = {
                        emit: ({event, args}: { event: string, args: any[] }) => {
                            if (!!externalRenderListener![event]) {
                                externalRenderListener![event].apply(this, args)
                            }
                            if (!!externalRenderListener!['emit']) {
                                externalRenderListener!['emit'].apply(this, [{event, args}])
                            }
                            if (!!listener![event]) {
                                listener![event].apply(this, args)
                            }
                            if (!!listener!['emit']) {
                                listener!['emit'].apply(this, [{event, args}])
                            }
                        },
                    }

                    const targetPopperProps = {
                        ...PopperAgentDefaultPopperProps,
                        ...defaultPopperProps,
                        ...popperProps,
                    }

                    return {
                        targetListener,
                        targetPopperProps,
                        popperListener,

                        reference,
                        props: props as any,
                        beforeShow,
                        beforeHide,
                        isPrivate,
                        agent: serviceProps.agent!,
                    }
                })

                const popperBinding = computed(() => {
                    const {targetPopperProps: popperProps, popperListener, reference} = option.value
                    return {
                        props: {
                            reference,
                            value: option.value.agent.state.show,
                            open: option.value.agent.state.open,
                            popperClass: `pl-popper-service-${name}-content`,
                            ...popperProps,
                        },
                        on: {
                            emit: ({event, args}: { event: string, args: any[] }) => {
                                if (!!externalPopperListener![event]) {
                                    externalPopperListener![event].apply(this, args)
                                }
                                if (!!popperListener[event]) {
                                    popperListener[event].apply(this, args)
                                }
                            },
                            input: val => option.value.agent.state.show = val,
                            'update:open': val => option.value.agent.state.open = val,
                            'click-body': async () => {
                                if (hideOnClickBody && option.value.agent.state.show) {
                                    await option.value.agent.hide()
                                }
                            },
                        }
                    }
                })

                return {
                    refer: {
                        popperBinding,
                        option,
                        state,
                    },
                    render: () => {
                        return (
                            <pl-popper className={ComponentName} {...popperBinding.value} key={state.count}>
                                {render(this.$createElement, this as any)}
                            </pl-popper>
                        )
                    },
                }
            },
        },
    )
}