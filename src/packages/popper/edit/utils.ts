import {ReferenceType, VNodeChild} from "../../../shims";
import {createPopperServiceComponent} from "./createPopperServiceComponent";

export interface PopperAgent {
    isShow: boolean,
    isOpen: boolean,
    show: () => void | Promise<void>,
    hide: () => void | Promise<void>,
    toggle: () => void | Promise<void>,
    destroy: () => void | Promise<void>,
}

export interface CreateAgentGetterOption {
    name: string,
    render: (attrs: any) => VNodeChild,
    defaultPopperAttrs?: object,
    defaultRenderAttrs?: {
        [k: string]: () => void | string | number | null | undefined | object | boolean | any[]
    },
    hideOnClickBody?: boolean,
}

export interface SpecificPopperServiceOption {
    reference: ReferenceType,
    popperAttr?: object,
    renderAttr?: object,
}

export type PopperServiceComponentOption = {
    defaultOption: Readonly<CreateAgentGetterOption>,
    serviceOption: SpecificPopperServiceOption,
    getService?: () => ReturnType<typeof createPopperServiceComponent>["use"]["class"]
}