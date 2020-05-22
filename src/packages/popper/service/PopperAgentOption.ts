export interface PopperAgentOption {
    reference: Element | HTMLElement | (() => (Element | HTMLElement)),

    beforeShow?: Function,
    beforeHide?: Function,

    popperProps?: object,
    popperListener?: object,

    props?: object,
    listener?: object,

    isPrivate?: boolean,
}