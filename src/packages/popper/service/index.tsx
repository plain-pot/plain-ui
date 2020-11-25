import {SimpleFunction, VNodeChild} from "../../../shims";
import {registryRootService} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {PopperService} from "./popper-service";
import {App, reactive, computed, ComponentPublicInstance} from 'vue';
import {createPlainEvent, PlainEvent} from "../../../plugins/Event";

export interface PopperServiceOption {
    reference: () => any,
    render: () => VNodeChild,
    popperAttrs: () => any,

    getService?: () => typeof PopperService.use.class
}

export type PopperAgent = ReturnType<typeof getPopperService>

const getPopperService = registryRootService(
    'popper',
    createDefaultManager('pl-popper-manager', PopperService),
    (getManager, ins) => {

        return (option: PopperServiceOption) => {

            /*---------------------------------------create popper agent-------------------------------------------*/
            const state = reactive({
                option,
            })
            const service = computed(() => {
                if (!state.option.getService) {
                    return null
                }
                return state.option.getService()
            })
            const isShow = computed(() => !!service.value && service.value.isShow.value)
            const isOpen = computed(() => !!service.value && service.value.isShow.value)

            const agent = reactive({
                isShow, isOpen, service,
                show: () => {
                    if (!!agent.service) {
                        // console.log('reuse service')
                        agent.service.show()
                    } else {
                        // console.log('request service')
                        getManager().then(manager => manager.service(option))
                    }
                },
                hide: () => {
                    if (!!agent.service) {
                        agent.service.hide()
                    }
                },
                toggle: () => {
                    if (isShow.value) {
                        agent.hide()
                    } else {
                        agent.show()
                    }
                },
            })

            console.warn('on', (ins as any)._.uid, ins)
            UnmountListener.on(ins, () => {
                console.log('unmount')
                agent.hide()
            })

            return agent
        }
    },
)

const UnmountListener = (() => {

    const map = new WeakMap<ComponentPublicInstance, PlainEvent>()
    const EVENT_NAME = 'UnmountListener'

    return {
        /**
         * 派发了beforeUnmount事件之后，组件已经销毁，所以event已经没有必要了，这里也要销毁event
         * @author  韦胜健
         * @date    2020/11/25 21:28
         */
        emit: (ctx: ComponentPublicInstance) => {
            const event = map.get(ctx)
            // @ts-ignore
            if (!!ctx.basicUsage) {
                console.log('emit', (ctx as any)._.uid, event, ctx)
            }
            if (!!event) {
                event.emit(EVENT_NAME)
                event.clear()
                map.delete(ctx)
            }
        },
        on: (ctx: ComponentPublicInstance, handler: SimpleFunction) => {
            let event = map.get(ctx)
            if (!event) {
                event = createPlainEvent()
                map.set(ctx, event)
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
                        console.log('beforeCreate inner', this._.uid, this.$el)
                        return getPopperService(this)
                    },
                })
            },
            beforeUnmount() {
                console.log('beforeUnmount', this._.uid, this.$el)
                UnmountListener.emit(this)
            }
        })
    },
}