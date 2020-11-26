import {ReferenceType} from "../../../shims";
import {createPopperServiceComponent} from "./createPopperServiceComponent";

export interface PopperAgent {
    isShow: boolean,
    isOpen: boolean,
    show: () => void | Promise<void>,
    hide: () => void | Promise<void>,
    toggle: () => void | Promise<void>,
    destroy: () => void | Promise<void>,
}

export interface SpecificPopperServiceOption {
    getService?: () => ReturnType<typeof createPopperServiceComponent>["use"]["class"]
    reference: ReferenceType,
    popperAttr?: object,
    renderAttr?: object,
}