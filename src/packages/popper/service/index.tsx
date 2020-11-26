import {SimpleFunction, VNodeChild} from "../../../shims";
import {registryRootService, RootServiceScope} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {PopperService} from "./popper-service";
import {App, computed, reactive} from 'vue';
import {createPlainEvent, PlainEvent} from "../../../plugins/Event";

export interface PopperServiceOption {
    reference: () => any,                                                   // popper reference 目标元素
    render: () => VNodeChild,                                               // popper content 内容
    popperAttrs: () => any,                                                 // pl-popper 属性或者监听的事件
    getService?: () => typeof PopperService.use.class,                      // option被提供服务之后，service与option绑定关系
    hideOnClickBody?: boolean,                                              // 是否点击外部body的时候自动关闭
}

const getPopperService = registryRootService(
    'popper',
    createDefaultManager('pl-popper-manager', PopperService),
    (getManager, ins) => {

        return (option: PopperServiceOption) => {

            /*---------------------------------------create popper agent-------------------------------------------*/
            const state = reactive({option})
            const service = computed(() => !state.option.getService ? null : state.option.getService())
            const isShow = computed(() => !!service.value && service.value.isShow.value)
            const isOpen = computed(() => !!service.value && service.value.isShow.value)
            const agent = reactive({
                isShow,
                isOpen,
                service,
                show: () => !!agent.service ? agent.service.show() : getManager().then(manager => manager.service(option)),
                hide: () => !!agent.service && agent.service.hide(),
                toggle: () => isShow.value ? agent.hide() : agent.show(),
                destroy: () => {
                    agent.hide()
                    state.option.getService = undefined
                }
            })

            UnmountListener.on(ins, () => {
                agent.hide()
                state.option.getService = undefined
            })

            return agent
        }
    },
    RootServiceScope.ins,
)

const UnmountListener = (() => {

    const map = new Map<string, PlainEvent>()
    const EVENT_NAME = 'UnmountListener'

    return {
        /**
         * 派发了beforeUnmount事件之后，组件已经销毁，所以event已经没有必要了，这里也要销毁event
         * @author  韦胜健
         * @date    2020/11/25 21:28
         */
        emit: (ctx: any) => {
            const event = map.get(ctx._.uid)
            if (!!event) {
                event.emit(EVENT_NAME)
                event.clear()
                map.delete(ctx)
            }
        },
        on: (ctx: any, handler: SimpleFunction) => {
            let event = map.get(ctx._.uid)
            if (!event) {
                event = createPlainEvent()
                map.set(ctx._.uid, event)
            }
            event.on(EVENT_NAME, handler)
        },
    }
})();

export default {
    install(app: App) {
        app.mixin({
            beforeCreate() {
                Object.defineProperty(this, '$popper', {
                    get() {
                        return getPopperService(this)
                    },
                })
            },
            beforeUnmount() {
                UnmountListener.emit(this)
            }
        })
    },
}