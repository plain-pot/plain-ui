import {nextIndex, onBeforeUnmount, onMounted, provide, reactive, ref, useRefs, useStyles, VueNode} from "plain-design-composition";
import {createDefaultService} from "../PlRoot/createDefaultService";
import {ClickBodyListener} from "../../utils/ClickBodyListener";
import {Transition} from "vue";

export type ContextmenuReference = MouseEvent | HTMLElement | { x: number, y: number } | Element | EventTarget | null
export type ContextContent = (() => VueNode) | { label: string, icon?: string, disabled?: string }[]

export interface ContextmenuServiceOption {
    reference: ContextmenuReference,
    content: ContextContent,
    width?: number,
    height?: number,
    backgroundColor?: string,
    hide?: () => void,
}

export function getReferencePosition(reference: ContextmenuReference, bodyPos: { width: number, height: number }): { top: number, left: number } {
    if (!reference) {
        throw new Error('reference is null')
    }
    const maxPos = {top: document.body.scrollHeight - bodyPos.height, left: document.body.scrollWidth - bodyPos.width}
    let pos = {top: 0, left: 0}

    if ('addEventListener' in reference) {
        let el = reference
        if ('getBoundingClientRect' in el) {
            const {top, left, height} = el.getBoundingClientRect()
            pos = {
                top: top + height,
                left: left,
            }
        } else {
            console.log('reference', reference)
            throw new Error('getBoundingClientRect not exist in reference')
        }
    } else if ('clientX' in reference) {
        const {clientX, clientY} = reference
        pos = {
            top: clientY,
            left: clientX,
        }
    } else {
        pos = {
            top: reference.y,
            left: reference.x,
        }
    }

    if (pos.left > maxPos.left) {pos.left = maxPos.left}
    if (pos.top > maxPos.top) {pos.top = maxPos.top}

    return pos
}

export const PlContextMenuService = createDefaultService({
    name: 'pl-contextmenu-service',
    setup(option: ContextmenuServiceOption) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const isShow = ref(false)
        const isOpen = ref(false)
        const state = reactive({
            option,
            zIndex: nextIndex(),
            bodyPos: null,
        }) as { option: ContextmenuServiceOption, zIndex: number, bodyPos: { width: number, height: number } | null, }

        const mounted = new Promise<void>(resolve => onMounted(resolve))
        let hideTimer: number | null = null
        let onTransitionEnd: (() => void) | null = null

        const methods = {
            service: (option: ContextmenuServiceOption) => {
                state.option = option
                methods.show()
                option.hide = () => methods.hide()
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
            if (!state.bodyPos) {
                style.opacity = 0
                return
            }
            const {top, left} = getReferencePosition(state.option.reference, state.bodyPos)
            style.top = `${top}px`
            style.left = `${left}px`
            style.zIndex = state.zIndex
        })

        const bodyStyles = useStyles(style => {
            const {width, height} = state.option
            !!width && (style.width = `${width}px`);
            !!height && (style.height = `${height}px`);
            style.backgroundColor = state.option.backgroundColor || 'white'
        })

        const handler = {
            onTransitionEnd: () => !!onTransitionEnd && onTransitionEnd(),
            onMousedownWindow: (e: MouseEvent) => {
                if (!refs.el!.contains(e.target as HTMLDivElement)) {
                    hideTimer = setTimeout(() => methods.hide(), 50) as any as number
                }
            },
            clickDropdownOption: () => {
                methods.hide()
            },
        }

        onBeforeUnmount(ClickBodyListener.listen(handler.onMousedownWindow))

        provide('@@pl-dropdown', {handler})

        return {
            refer: {
                state,
                isShow,
                isOpen,
                ...methods,
            },
            render: () => {

                let content: VueNode;
                if (typeof state.option.content === "function") {
                    content = state.option.content()
                } else {
                    content = state.option.content.map(item => <div>
                        {item.label}
                    </div>)
                }

                return (
                    <div class="pl-contextmenu-service" style={styles.value} ref={onRef.el} {...{show: String(isShow.value)} as any}>
                        <Transition
                            key={state.zIndex}
                            name="pl-transition-scale"
                            onEnter={() => state.bodyPos = {width: refs.el!.offsetWidth, height: refs.el!.offsetHeight}}
                            onAfterEnter={handler.onTransitionEnd}
                            onAfterLeave={handler.onTransitionEnd}>
                            <div class="pl-contextmenu-service-body" style={bodyStyles.value} v-show={isShow.value}>
                                {content}
                            </div>
                        </Transition>
                    </div>
                )
            }
        }
    },
})

export type PlContextMenuServiceComponent = typeof PlContextMenuService.use.class
