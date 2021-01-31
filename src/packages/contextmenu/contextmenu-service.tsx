import {registryRootService} from "../root/registryRootService";
import {VNodeChild} from "../../shims";
import {onBeforeUnmount, onMounted, reactive, ref, Transition, provide} from 'vue';
import {createDefaultService} from "../root/createDefaultService";
import {createDefaultManager} from "../root/createDefaultManager";
import {getServiceWithoutContext} from "../../utils/getServiceWithoutContext";
import './contextmenu-service.scss'
import {useStyles} from "../../use/useStyles";
import {useRefs} from "../../use/useRefs";
import {nextIndex} from "../../utils/nextIndex";
import {PlDropdownOption} from "../dropdown/dropdown-option";
import {PlDropdownMenu} from "../dropdown/dropdown-menu";

type ContextmenuReference = MouseEvent | HTMLElement | { $el: HTMLElement } | { x: number, y: number }
type ContextContent = (() => VNodeChild) | { label: string, icon?: string, disabled?: string }[]

interface ContextmenuServiceOption {
    reference: ContextmenuReference,
    content: ContextContent,
    width?: number,
    height?: number,
}

function getReferencePosition(reference: ContextmenuReference): { top: number, left: number } {
    if ('addEventListener' in reference || '$el' in reference) {
        let el = '$el' in reference ? reference.$el : reference
        const {top, left, height} = el.getBoundingClientRect()
        return {
            top: top + height,
            left: left,
        }
    } else if ('clientX' in reference) {
        const {clientX, clientY} = reference
        return {
            top: clientY,
            left: clientX,
        }
    } else {
        return {
            top: reference.y,
            left: reference.x,
        }
    }
}

const Service = createDefaultService({
    name: 'pl-contextmenu-service',
    components: {
        'pl-dropdown-option': PlDropdownOption,
        'pl-dropdown-menu': PlDropdownMenu,
    },
    setup(option: ContextmenuServiceOption) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })
        const isShow = ref(false)
        const isOpen = ref(false)
        const state = reactive({
            option,
            zIndex: nextIndex(),
        })
        const mounted = new Promise(resolve => onMounted(resolve))
        let hideTimer: number | null = null
        let onTransitionEnd: (() => void) | null = null

        const methods = {
            service: (option: ContextmenuServiceOption) => {
                state.option = option
                methods.show()
                return methods.hide
            },
            show: async () => {
                if (!!hideTimer) clearTimeout(hideTimer)
                state.zIndex = nextIndex()
                await mounted;
                isShow.value = true
                onTransitionEnd = () => {
                    isOpen.value = true
                    onTransitionEnd = null
                }
            },
            hide: () => {
                isShow.value = false
                onTransitionEnd = () => {
                    isOpen.value = false
                    onTransitionEnd = null
                }
            },
        }

        const styles = useStyles(style => {
            const {top, left} = getReferencePosition(state.option.reference)
            style.top = `${top}px`
            style.left = `${left}px`
            style.zIndex = state.zIndex
        })

        const bodyStyles = useStyles(style => {
            const {width, height} = state.option
            !!width && (style.width = `${width}px`);
            !!height && (style.height = `${height}px`);
        })

        const handler = {
            onTransitionEnd: () => !!onTransitionEnd && onTransitionEnd(),
            onMousedownWindow: (e: MouseEvent) => {
                if (!refs.el.contains(e.target as HTMLDivElement)) {
                    hideTimer = setTimeout(() => methods.hide(), 50)
                }
            },
            clickDropdownOption: () => {
                methods.hide()
            },
        }

        document.body.addEventListener('mouseup', handler.onMousedownWindow)
        onBeforeUnmount(() => document.body.removeEventListener('mouseup', handler.onMousedownWindow))

        provide('@@pl-dropdown', {handler})

        return {
            refer: {
                state,
                isShow,
                isOpen,
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
                    <div class="pl-contextmenu-service" style={styles.value} ref="el" {...{show: String(isShow.value)} as any}>
                        <Transition name="pl-transition-scale" onAfterEnter={handler.onTransitionEnd} onAfterLeave={handler.onTransitionEnd}>
                            <div class="pl-contextmenu-service-body" v-show={isShow.value} style={bodyStyles.value}>
                                {content}
                            </div>
                        </Transition>
                    </div>
                )
            }
        }
    },
})

type ServiceComponent = typeof Service.use.class

export const getContextmenuService = registryRootService(
    'contextmenu',
    createDefaultManager('pl-contextmenu-service-manager', Service, ((items: ServiceComponent[], option: ContextmenuServiceOption) => {

        const newPos = getReferencePosition(option.reference)
        let exist: ServiceComponent | null = null
        let available: ServiceComponent | null = null
        items.forEach(item => {
            if (!!exist) {
                return
            }
            if (item.state.option === option) {
                exist = item
                return;
            }
            const oldPos = getReferencePosition(item.state.option.reference)
            if (oldPos.top === newPos.top && oldPos.left === newPos.left) {
                exist = item
                return;
            }
            if (!item.isShow.value && !item.isOpen.value) {
                available = item
            }
        })
        return exist || available
    }) as any),
    (getManager) => {
        return async (reference: ContextmenuReference, content: ContextContent) => {
            const option = {reference, content}
            const manager = await getManager()
            return manager.service(option)
        }
    }
)

export const $$contextmenu = getServiceWithoutContext(getContextmenuService)