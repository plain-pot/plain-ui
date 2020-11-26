export interface PopperAgent {
    isShow: boolean,
    isOpen: boolean,
    show: () => void | Promise<void>,
    hide: () => void | Promise<void>,
    toggle: () => void | Promise<void>,
    destroy: () => void | Promise<void>,
}