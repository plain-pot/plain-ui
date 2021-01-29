import {registryRootService} from "../root/registryRootService";
import {VNodeChild} from "../../shims";
import {reactive, ref, Transition, onBeforeUnmount, onMounted} from 'vue';
import {createDefaultService} from "../root/createDefaultService";
import {createDefaultManager} from "../root/createDefaultManager";
import {getServiceWithoutContext} from "../../utils/getServiceWithoutContext";
import './contextmenu-service.scss'
import {useStyles} from "../../use/useStyles";
import {useRefs} from "../../use/useRefs";

type ContextmenuReference = MouseEvent | HTMLElement | { $el: HTMLElement } | { x: string, y: string }
type ContextContent = (() => VNodeChild) | { label: string, icon?: string, disabled?: string }[]

interface ContextmenuServiceOption {
    reference: ContextmenuReference,
    content: ContextContent,
}

const Service = createDefaultService({
    name: 'pl-contextmenu-service',
    setup(option: ContextmenuServiceOption) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })
        const isShow = ref(false)
        const state = reactive({
            option,
        })
        const mounted = new Promise(resolve => onMounted(resolve))

        const methods = {
            service: (option: ContextmenuServiceOption) => {
                state.option = option
                methods.show()
                return methods.hide
            },
            show: async () => {
                if (isShow.value) return
                await mounted;
                console.log('show')
                isShow.value = true
            },
            hide: () => {
                if (!isShow.value) return
                console.log('hide')
                isShow.value = false
            },
        }

        const styles = useStyles(style => {
            const {reference} = state.option
            if ('addEventListener' in reference) {
                const {top, left, height} = reference.getBoundingClientRect()
                style.top = `${top + height}px`
                style.left = `${left}px`
            } else if ('clientX' in reference) {
                const {clientX, clientY} = reference
                style.top = `${clientY}px`
                style.left = `${clientX}px`
            } else if ('$el' in reference) {
                const {top, left, height} = reference.$el.getBoundingClientRect()
                style.top = `${top + height}px`
                style.left = `${left}px`
            } else {
                style.top = `${reference.y}px`
                style.left = `${reference.x}px`
            }
        })

        const handler = {
            onMousedownWindow: (e: MouseEvent) => {
                if (!refs.el.contains(e.target as HTMLDivElement)) {
                    methods.hide()
                }
            }
        }

        document.body.addEventListener('mouseup', handler.onMousedownWindow)
        onBeforeUnmount(() => document.body.removeEventListener('mouseup', handler.onMousedownWindow))

        return {
            refer: {
                isShow,
                isOpen: isShow,
                ...methods,
            },
            render: () => {

                let content: VNodeChild;
                if (typeof state.option.content === "function") {
                    content = state.option.content()
                } else {
                    content = state.option.content.map(item => <div>
                        {item.label}
                    </div>)
                }

                return (
                    <div class="pl-contextmenu-service" style={styles.value} ref="el">
                        <Transition name="pl-transition-scale">
                            <div class="pl-contextmenu-service-body" v-show={isShow.value}>
                                {content}
                            </div>
                        </Transition>
                    </div>
                )
            }
        }

    },
})

export const getContextmenuService = registryRootService(
    'contextmenu',
    createDefaultManager('pl-contextmenu-service-manager', Service),
    (getManager) => {
        return async (reference: ContextmenuReference, content: ContextContent) => {
            const option = {reference, content}
            const manager = await getManager()
            return manager.service(option)
        }
    }
)

export const $$contextmenu = getServiceWithoutContext(getContextmenuService)