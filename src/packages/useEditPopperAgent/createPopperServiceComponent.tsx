/**
 * 生成id的计数器，每次show的时候获取一个新的计数器，一遍令render重新渲染
 * @author  韦胜健
 * @date    2020/11/27 9:31
 */
import {computed, reactive, ref} from "plain-ui-composition";
import {createCounter} from "plain-ui-composition"
import {createDefaultService} from "../PlRoot/createDefaultService";
import {delay} from "plain-utils/utils/delay";
import {PopperServiceComponentOption} from "./useEditPopperAgent.utils";
import PlPopper from "../PlPopper";


const counter = createCounter('popper-service-component')

/**
 * 合并attrs
 * @author  韦胜健
 * @date    2020/11/27 9:31
 */
const mergeAttrs = (() => {
    const LISTENER_MATCH_REG = /on[A-Z]/
    return (config: { attrs: any, defaultAttrs: any, agent: any }) => {
        const {agent} = config
        let attrs = config.attrs || {}
        let defaultAttrs = config.defaultAttrs || {}
        if (typeof attrs === "function") {attrs = attrs()}
        if (typeof defaultAttrs === "function") {defaultAttrs = defaultAttrs()}

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

/**
 * 创建一个基于 pl-popper 的service 组件
 * @author  韦胜健
 * @date    2020/11/27 9:31
 */
export function createPopperServiceComponent(name: string) {
    return createDefaultService({
        name,
        setup(option: PopperServiceComponentOption) {

            /*当前是否显示/隐藏*/
            const isShow = ref(false)
            /*当前是否已经显示/隐藏*/
            const isOpen = ref(false)

            const state = reactive({
                option,                                 // 当前服务的option
                renderKey: counter(),                   // 用于刷新render的key
            })

            /**
             * 开始服务
             * @author  韦胜健
             * @date    2020/11/27 9:32
             */
            async function service(option: PopperServiceComponentOption) {
                let newKey = true
                if (!option.getService || option.getService !== getRefer) {
                    /*clear*/
                    state.option.getService = undefined
                    /*init*/
                    state.option = option
                    state.option.getService = getRefer
                    state.renderKey = counter()
                    newKey = false
                    await delay()
                }
                await show(newKey)
            }

            /**
             * 显示服务
             * @author  韦胜健
             * @date    2020/11/27 9:33
             * @param   newKey          默认情况下每次show之前都应该重新初始化内容，避免不必要的bug
             */
            async function show(newKey = true) {
                if (newKey) {
                    state.renderKey = counter()
                    await delay()
                }
                isShow.value = true
            }

            /**
             * 隐藏服务
             * @author  韦胜健
             * @date    2020/11/27 9:33
             */
            function hide() {isShow.value = false}

            /**
             * service本身暴露的对象
             * @author  韦胜健
             * @date    2020/11/27 9:39
             */
            const refer = {state, isShow, isOpen, service, show, hide,}

            /**
             * service本身暴露对象的引用，保存在option.getService中，用于标记service与option的绑定关系
             * @author  韦胜健
             * @date    2020/11/27 9:39
             */
            const getRefer = () => refer

            /**
             * 合并后的popper属性
             * @author  韦胜健
             * @date    2020/11/27 9:40
             */
            const popperAttrs = computed(() => {
                let {defaultOption: {defaultPopperAttrs}, serviceOption: {popperAttrs}} = state.option
                return mergeAttrs({agent: refer, attrs: popperAttrs, defaultAttrs: defaultPopperAttrs,})
            })

            /**
             * 合并之后的render属性
             * @author  韦胜健
             * @date    2020/11/27 9:40
             */
            const renderAttrs = computed(() => {
                let {defaultOption: {defaultRenderAttrs}, serviceOption: {renderAttrs}} = state.option
                return {
                    ...mergeAttrs({agent: refer, attrs: renderAttrs, defaultAttrs: defaultRenderAttrs,}),
                    key: state.renderKey,
                }
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
                    <PlPopper
                        v-model={isShow.value}
                        onClickBody={handler.onClickBody}
                        popperAttrs={{['service-name']: name}}
                        transition={'pl-transition-scale'}
                        noContentPadding
                        trigger={'manual'}
                        reference={state.option.serviceOption.reference}
                        onUpdateOpen={val => isOpen.value = !!val}
                        {...popperAttrs.value}
                        popper={state.option.defaultOption.render(renderAttrs.value)}
                    />
                )
            }
        },
    })
}
