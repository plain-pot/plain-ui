/**
 * 在调用对应服务的时候，参数格式
 * @author  韦胜健
 * @date    2020/9/27 23:21
 */
import {POPPER_PROPS} from "@/packages/popper/popper";
import * as Vue from "vue/types/umd";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {usePopperAgent} from "@/packages/popper/agent/usePopperAgent";

export interface PopperAgentOption {
    reference: Element | HTMLElement,
    beforeShow?: () => void,
    beforeHide?: () => void,
    popperProps?: Partial<ExtractPropTypes<typeof POPPER_PROPS>>,
    popperListener?: object,
    props?: object,
    listener?: object,
    isPrivate?: boolean,
}

/**
 * 在创建PopperService组件的时候参数对象
 * @author  韦胜健
 * @date    2020/9/27 23:20
 */
export interface PopperServiceOption {
    name: string,
    render: (h: Vue["$createElement"], ctx: { _refer: PopperServiceComponent["value"] }) => any,
    externalRenderListener?: { [k: string]: (...args: any[]) => any },
    externalPopperListener?: { [k: string]: (...args: any[]) => any },
    defaultPopperProps?: Partial<ExtractPropTypes<typeof POPPER_PROPS>>,
    hideOnClickBody?: boolean,
}


export const PopperAgentDefaultPopperProps = {
    placement: 'bottom-start',
    trigger: 'manual',
    transition: 'pl-transition-scale',
}

export type PopperAgent = ReturnType<typeof usePopperAgent>
export type EditPopperAgent = ReturnType<typeof usePopperAgentEditor>
export type PopperServiceComponent = ReturnType<ReturnType<typeof createPopperService>["use"]["ref"]>