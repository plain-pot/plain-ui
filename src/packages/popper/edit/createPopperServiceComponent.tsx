import {createDefaultService} from "../../root/createDefaultService";
import {nextTick, reactive, ref, computed} from 'vue';
import {PopperServiceComponentOption} from "./utils";

const mergeAttrs = (() => {
    const LISTENER_MATCH_REG = /on[A-Z]/
    return (config: { attrs: any, defaultAttrs: any, agent: any }) => {
        const {agent} = config
        const attrs = config.attrs || {}
        const defaultAttrs = config.defaultAttrs || {}
        const result = {} as any
        Object.keys({...attrs, ...defaultAttrs}).forEach(key => {
            if (LISTENER_MATCH_REG.test(key)) {
                result[key] = (...args: any[]) => {
                    !!(attrs as any)[key] && (attrs as any)[key].apply(agent, args);
                    !!(defaultAttrs as any)[key] && (defaultAttrs as any)[key].apply(agent, args);
                }
            } else {
                if (key in attrs) {
                    result[key] = attrs[key]
                } else {
                    result[key] = defaultAttrs[key]
                }
            }
        })
        return result
    }
})();

export function createPopperServiceComponent(name: string) {
    return createDefaultService({
        name,
        setup(option: PopperServiceComponentOption) {

            const isShow = ref(false)
            const isOpen = ref(false)

            const state = reactive({option,})

            async function service(option: PopperServiceComponentOption) {
                if (!option.getService || option.getService !== getRefer) {
                    /*clear*/
                    state.option.getService = undefined
                    /*init*/
                    state.option = option
                    state.option.getService = getRefer
                    await nextTick()
                }
                show()
            }

            function show() {isShow.value = true}

            function hide() {isShow.value = false}

            const refer = {state, isShow, isOpen, service, show, hide,}

            const getRefer = () => refer

            const popperAttrs = computed(() => {
                let {defaultOption: {defaultPopperAttrs}, serviceOption: {popperAttrs}} = state.option
                return mergeAttrs({agent: refer, attrs: popperAttrs, defaultAttrs: defaultPopperAttrs,})
            })

            const renderAttrs = computed(() => {
                let {defaultOption: {defaultRenderAttrs}, serviceOption: {renderAttrs}} = state.option
                return mergeAttrs({agent: refer, attrs: renderAttrs, defaultAttrs: defaultRenderAttrs,})
            })

            const handler = {
                onClickBody: () => {
                    if (state.option.serviceOption.hideOnClickBody !== false) {
                        refer.hide()
                    }
                },
            }

            return {
                refer,
                render: () => (
                    <pl-popper
                        v-model={isShow.value}
                        onClickBody={handler.onClickBody}
                        {...{
                            trigger: 'manual',
                            reference: state.option.serviceOption.reference,
                            'onUpdate:open': (val: boolean) => isOpen.value = val,
                            ...popperAttrs.value,
                        }}
                        v-slots={{
                            popper: () => state.option.defaultOption.render(renderAttrs.value),
                        }}
                    />
                )
            }
        },
    })
}