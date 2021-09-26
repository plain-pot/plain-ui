import {createPopperServiceComponent} from "./createPopperServiceComponent";
import {VueNode} from "plain-ui-composition";
import {PlainObject} from "plain-utils/utils/event";

export interface PopperAgent {
    state: { option: PopperServiceComponentOption, },
    isShow: boolean,
    isOpen: boolean,
    show: () => void | Promise<void>,
    hide: () => void | Promise<void>,
    toggle: () => void | Promise<void>,
    destroy: () => void | Promise<void>,
}

interface Attrs {
    [k: string]: ((this: PopperAgent, ...args: any[]) => void) | string | number | null | undefined | PlainObject | boolean | any[]
}

export interface CreateAgentGetterOption {
    name: string,
    render: (attrs: any) => VueNode,
    defaultPopperAttrs?: Attrs | (() => Attrs),
    defaultRenderAttrs?: Attrs | (() => Attrs),
}

export interface SpecificPopperServiceOption {
    reference: PlainObject | (() => PlainObject),
    popperAttrs?: Attrs | (() => Attrs),
    renderAttrs?: Attrs | (() => Attrs),
    hideOnClickBody?: boolean,
}

export type PopperServiceComponentOption = {
    defaultOption: Readonly<CreateAgentGetterOption>,
    serviceOption: SpecificPopperServiceOption,
    getService?: () => ReturnType<typeof createPopperServiceComponent>["use"]["class"]
}
